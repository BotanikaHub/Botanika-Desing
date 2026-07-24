"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentCreatorAccount } from "@/lib/auth";

export type TermState = { error?: string } | null;

const schema = z.object({
  brandSlug: z.string().min(1),
  termsName: z.string().min(3, "Informe seu nome completo."),
  termsCpf: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((s) => s.length === 11, "CPF inválido."),
  shipCep: z.string().min(8, "Informe o CEP."),
  shipStreet: z.string().min(2, "Informe a rua."),
  shipNumber: z.string().min(1, "Informe o número."),
  shipComplement: z.string().optional(),
  shipDistrict: z.string().min(2, "Informe o bairro."),
  shipCity: z.string().min(2, "Informe a cidade."),
  shipState: z.string().min(2, "Informe o estado (UF)."),
  accept: z.string().refine((v) => v === "on", "Você precisa aceitar o termo."),
});

// A creator aceita o termo (aceite eletrônico) e confirma o endereço de envio.
// Ao concluir, entra na lista de envio ativa da marca.
export async function acceptTermsAction(
  _prev: TermState,
  formData: FormData,
): Promise<TermState> {
  const account = await getCurrentCreatorAccount();
  if (!account) redirect("/entrar");

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dados inválidos." };
  }
  const d = parsed.data;

  const membership = account.creators.find(
    (c) => c.brand.slug === d.brandSlug.toLowerCase() && c.status === "APPROVED",
  );
  if (!membership) return { error: "Cadastro não encontrado ou ainda não aprovado." };

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null;

  await prisma.creator.update({
    where: { id: membership.id },
    data: {
      termsAcceptedAt: new Date(),
      termsVersion: membership.brand.termVersion,
      termsName: d.termsName.trim(),
      termsCpf: d.termsCpf,
      termsIp: ip,
      shipCep: d.shipCep.trim(),
      shipStreet: d.shipStreet.trim(),
      shipNumber: d.shipNumber.trim(),
      shipComplement: d.shipComplement?.trim() || null,
      shipDistrict: d.shipDistrict.trim(),
      shipCity: d.shipCity.trim(),
      shipState: d.shipState.trim().toUpperCase().slice(0, 2),
      shippingActive: true,
    },
  });

  revalidatePath("/painel", "layout");
  redirect(`/painel/${d.brandSlug.toLowerCase()}`);
}
