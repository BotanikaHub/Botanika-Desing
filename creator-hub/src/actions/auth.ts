"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  loginCreator,
  logoutCreator,
  loginAdmin,
  logoutAdmin,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

export type LoginState = { error?: string } | null;

export async function creatorLoginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dados inválidos." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const creator = await prisma.creator.findUnique({ where: { email } });

  if (!creator || !(await verifyPassword(parsed.data.password, creator.passwordHash))) {
    return { error: "E-mail ou senha incorretos." };
  }

  await loginCreator(creator.id);
  redirect("/dashboard");
}

export async function creatorLogoutAction() {
  await logoutCreator();
  redirect("/login");
}

export async function adminLoginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dados inválidos." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !(await verifyPassword(parsed.data.password, admin.passwordHash))) {
    return { error: "E-mail ou senha incorretos." };
  }

  await loginAdmin(admin.id);
  redirect("/admin");
}

export async function adminLogoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}
