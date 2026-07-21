"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  hashPassword,
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

const claimSchema = z.object({
  brandSlug: z.string().min(1),
  couponCode: z.string().min(1, "Informe o seu cupom."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
});

// Uma influencer que já tem cupom (importado da Shopify) assume o painel dela.
export async function claimCreatorAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = claimSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dados inválidos." };
  }

  const brand = await prisma.brand.findUnique({
    where: { slug: parsed.data.brandSlug.toLowerCase() },
  });
  if (!brand) return { error: "Marca não encontrada." };

  const code = parsed.data.couponCode.trim().toUpperCase();
  const creator = await prisma.creator.findUnique({
    where: { brandId_couponCode: { brandId: brand.id, couponCode: code } },
  });
  if (!creator) {
    return { error: "Cupom não encontrado nesta marca. Confira o código." };
  }
  if (creator.claimed) {
    return { error: "Esse cupom já tem um painel ativo. Faça login normalmente." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const clash = await prisma.creator.findUnique({
    where: { brandId_email: { brandId: brand.id, email } },
  });
  if (clash && clash.id !== creator.id) {
    return { error: "Já existe uma conta com este e-mail nesta marca." };
  }

  await prisma.creator.update({
    where: { id: creator.id },
    data: {
      email,
      passwordHash: await hashPassword(parsed.data.password),
      claimed: true,
    },
  });

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
