"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { suggestCoupon } from "@/lib/format";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  followers: z.string().optional(),
  niche: z.string().optional(),
  city: z.string().optional(),
  pitch: z.string().optional(),
  desiredCoupon: z.string().optional(),
});

export type ApplyState = { error?: string } | null;

export async function applyAction(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dados inválidos." };
  }

  const d = parsed.data;
  const email = d.email.trim().toLowerCase();

  const existing = await prisma.creator.findUnique({ where: { email } });
  if (existing) {
    return { error: "Já existe um cadastro com este e-mail." };
  }

  const followersNum = d.followers
    ? parseInt(d.followers.replace(/\D/g, ""), 10) || null
    : null;

  const desired = d.desiredCoupon?.trim()
    ? suggestCoupon(d.desiredCoupon)
    : suggestCoupon(d.instagram || d.name);

  await prisma.creator.create({
    data: {
      name: d.name.trim(),
      email,
      passwordHash: await hashPassword(d.password),
      phone: d.phone?.trim() || null,
      instagram: d.instagram?.trim() || null,
      tiktok: d.tiktok?.trim() || null,
      followers: followersNum,
      niche: d.niche?.trim() || null,
      city: d.city?.trim() || null,
      pitch: d.pitch?.trim() || null,
      desiredCoupon: desired,
      status: "PENDING",
    },
  });

  redirect("/apply/obrigado");
}
