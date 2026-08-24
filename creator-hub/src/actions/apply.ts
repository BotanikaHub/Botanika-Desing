"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { suggestCoupon } from "@/lib/format";

const schema = z.object({
  brandSlug: z.string().min(1),
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  followers: z.string().optional(),
  niche: z.string().optional(),
  profession: z.string().optional(),
  pitch: z.string().optional(),
  desiredCoupon: z.string().optional(),
  // Dados para contrato/pagamento (formulário unificado — coletados já no cadastro).
  cpf: z.string().optional(),
  pixKey: z.string().optional(),
  birthDate: z.string().optional(),
  // Endereço completo (para envio de kits).
  shipCep: z.string().optional(),
  shipStreet: z.string().optional(),
  shipNumber: z.string().optional(),
  shipComplement: z.string().optional(),
  shipDistrict: z.string().optional(),
  shipCity: z.string().optional(),
  shipState: z.string().optional(),
});

export type ApplyState = { error?: string } | null;

export async function applyAction(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dados inválidos." };
  }

  const d = parsed.data;
  const brand = await prisma.brand.findUnique({
    where: { slug: d.brandSlug.toLowerCase() },
  });
  if (!brand) return { error: "Marca não encontrada." };

  const email = d.email.trim().toLowerCase();

  const existing = await prisma.creator.findUnique({
    where: { brandId_email: { brandId: brand.id, email } },
  });
  if (existing) {
    return { error: "Já existe um cadastro com este e-mail nesta marca." };
  }

  const followersNum = d.followers
    ? parseInt(d.followers.replace(/\D/g, ""), 10) || null
    : null;

  const desired = d.desiredCoupon?.trim()
    ? suggestCoupon(d.desiredCoupon)
    : suggestCoupon(d.instagram || d.name);

  const clean = (v?: string) => v?.trim() || null;
  // "Cidade/UF" (usada nos cards) derivada do endereço quando informado.
  const cityLabel =
    clean(d.shipCity) && clean(d.shipState)
      ? `${d.shipCity!.trim()}/${d.shipState!.trim()}`
      : clean(d.shipCity);

  // Conta unificada: reusa a existente (mesma senha) ou cria.
  let account = await prisma.creatorAccount.findUnique({ where: { email } });
  if (account) {
    if (!(await verifyPassword(d.password, account.passwordHash))) {
      return {
        error: "Este e-mail já tem uma conta. Use a mesma senha da sua conta.",
      };
    }
  } else {
    account = await prisma.creatorAccount.create({
      data: {
        email,
        passwordHash: await hashPassword(d.password),
        name: d.name.trim(),
      },
    });
  }

  await prisma.creator.create({
    data: {
      brandId: brand.id,
      accountId: account.id,
      name: d.name.trim(),
      email,
      passwordHash: account.passwordHash,
      phone: d.phone?.trim() || null,
      instagram: d.instagram?.trim() || null,
      tiktok: d.tiktok?.trim() || null,
      followers: followersNum,
      niche: d.niche?.trim() || null,
      profession: d.profession?.trim() || null,
      city: cityLabel,
      pitch: d.pitch?.trim() || null,
      desiredCoupon: desired,
      // Dados de contrato/pagamento (formulário unificado).
      cpf: clean(d.cpf),
      pixKey: clean(d.pixKey),
      birthDate: clean(d.birthDate),
      // Endereço completo.
      shipCep: clean(d.shipCep),
      shipStreet: clean(d.shipStreet),
      shipNumber: clean(d.shipNumber),
      shipComplement: clean(d.shipComplement),
      shipDistrict: clean(d.shipDistrict),
      shipCity: clean(d.shipCity),
      shipState: clean(d.shipState),
      commissionRate: brand.defaultCommissionRate,
      status: "PENDING",
    },
  });

  redirect(`/${brand.slug}/apply/obrigado`);
}
