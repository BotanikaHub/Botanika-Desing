import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-insecure-secret-change-me",
);

const CREATOR_COOKIE = "botanika_creator_session";
const ADMIN_COOKIE = "botanika_admin_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

type Role = "creator" | "admin";
type SessionPayload = { sub: string; role: Role };

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

async function sign(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

async function readSession(cookieName: string): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

async function setSession(cookieName: string, payload: SessionPayload) {
  const token = await sign(payload);
  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

// ---------- Creator ----------
export async function loginCreator(creatorId: string) {
  await setSession(CREATOR_COOKIE, { sub: creatorId, role: "creator" });
}

export async function logoutCreator() {
  const store = await cookies();
  store.delete(CREATOR_COOKIE);
}

export async function getCurrentCreator() {
  const session = await readSession(CREATOR_COOKIE);
  if (!session || session.role !== "creator") return null;
  return prisma.creator.findUnique({ where: { id: session.sub } });
}

// ---------- Admin ----------
export async function loginAdmin(adminId: string) {
  await setSession(ADMIN_COOKIE, { sub: adminId, role: "admin" });
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function getCurrentAdmin() {
  const session = await readSession(ADMIN_COOKIE);
  if (!session || session.role !== "admin") return null;
  return prisma.admin.findUnique({ where: { id: session.sub } });
}
