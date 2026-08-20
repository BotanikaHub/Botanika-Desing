"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  hashPassword,
  loginCreatorAccount,
  logoutCreator,
  loginAdmin,
  logoutAdmin,
} from "@/lib/auth";

export type LoginState = { error?: string } | null;

const accountLoginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

// Login unificado da influencer (um e-mail/senha para todas as marcas).
export async function creatorAccountLoginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = accountLoginSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dados inválidos." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  let account = await prisma.creatorAccount.findUnique({ where: { email } });

  if (account) {
    if (!(await verifyPassword(parsed.data.password, account.passwordHash))) {
      return { error: "E-mail ou senha incorretos." };
    }
  } else {
    // Retrocompatibilidade: cria a conta a partir de um creator já reivindicado
    const creators = await prisma.creator.findMany({
      where: { email, claimed: true },
    });
    let matched: (typeof creators)[number] | null = null;
    for (const c of creators) {
      if (await verifyPassword(parsed.data.password, c.passwordHash)) {
        matched = c;
        break;
      }
    }
    if (!matched) return { error: "E-mail ou senha incorretos." };

    account = await prisma.creatorAccount.create({
      data: { email, passwordHash: matched.passwordHash, name: matched.name },
    });
    await prisma.creator.updateMany({
      where: { email, claimed: true, accountId: null },
      data: { accountId: account.id },
    });
  }

  await loginCreatorAccount(account.id);
  redirect("/painel");
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
  if (creator.status !== "APPROVED") {
    return { error: "Este cupom ainda não está liberado. Fale com a marca." };
  }
  if (creator.claimed) {
    return { error: "Esse cupom já tem um painel ativo. Faça login normalmente." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const clash = await prisma.creator.findUnique({
    where: { brandId_email: { brandId: brand.id, email } },
  });
  if (clash && clash.id !== creator.id) {
    return { error: "Já existe outra conta com este e-mail nesta marca." };
  }

  // Conta unificada: reusa a existente (mesma senha) ou cria.
  let account = await prisma.creatorAccount.findUnique({ where: { email } });
  if (account) {
    if (!(await verifyPassword(parsed.data.password, account.passwordHash))) {
      return {
        error: "Este e-mail já tem uma conta. Use a mesma senha da sua conta.",
      };
    }
  } else {
    account = await prisma.creatorAccount.create({
      data: {
        email,
        passwordHash: await hashPassword(parsed.data.password),
        name: creator.name,
      },
    });
  }

  await prisma.creator.update({
    where: { id: creator.id },
    data: {
      email,
      passwordHash: account.passwordHash,
      claimed: true,
      accountId: account.id,
    },
  });

  await loginCreatorAccount(account.id);
  redirect("/painel");
}

export async function creatorLogoutAction() {
  await logoutCreator();
  redirect("/entrar");
}

const adminLoginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

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
