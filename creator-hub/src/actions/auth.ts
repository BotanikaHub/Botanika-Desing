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

const creatorLoginSchema = z.object({
  brandSlug: z.string().min(1),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

const adminLoginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

export type LoginState = { error?: string } | null;

export async function creatorLoginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = creatorLoginSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dados inválidos." };
  }

  const brand = await prisma.brand.findUnique({
    where: { slug: parsed.data.brandSlug.toLowerCase() },
  });
  if (!brand) return { error: "Marca não encontrada." };

  const email = parsed.data.email.trim().toLowerCase();
  const creator = await prisma.creator.findUnique({
    where: { brandId_email: { brandId: brand.id, email } },
  });

  if (
    !creator ||
    !(await verifyPassword(parsed.data.password, creator.passwordHash))
  ) {
    return { error: "E-mail ou senha incorretos." };
  }

  await loginCreator(creator.id);
  redirect(`/${brand.slug}/dashboard`);
}

export async function creatorLogoutAction(formData: FormData) {
  const brandSlug = String(formData.get("brandSlug") || "");
  await logoutCreator();
  redirect(brandSlug ? `/${brandSlug}/login` : "/");
}

export async function adminLoginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = adminLoginSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dados inválidos." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (
    !admin ||
    !(await verifyPassword(parsed.data.password, admin.passwordHash))
  ) {
    return { error: "E-mail ou senha incorretos." };
  }

  await loginAdmin(admin.id);
  redirect("/admin");
}

export async function adminLogoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}
