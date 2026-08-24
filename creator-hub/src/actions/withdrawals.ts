"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentCreatorAccount } from "@/lib/auth";
import { getWithdrawalSummary } from "@/lib/withdrawals";

export type WithdrawalState = { error?: string; ok?: boolean } | null;

const MAX_NF_BYTES = 5.5 * 1024 * 1024; // ~5,5MB (limite do server action é 6MB)
const ALLOWED_NF = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

// Creator solicita saque da comissão disponível, anexando a Nota Fiscal.
export async function requestWithdrawalAction(
  _prev: WithdrawalState,
  formData: FormData,
): Promise<WithdrawalState> {
  const account = await getCurrentCreatorAccount();
  if (!account) return { error: "Sessão expirada. Entre novamente." };

  const creatorId = String(formData.get("creatorId") || "");
  const membership = account.creators.find((c) => c.id === creatorId);
  if (!membership) return { error: "Creator não encontrado." };
  if (membership.status !== "APPROVED" || !membership.couponCode) {
    return { error: "Seu cadastro ainda não está ativo." };
  }

  // Nota Fiscal (obrigatória).
  const file = formData.get("nf");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Anexe a Nota Fiscal para solicitar o saque." };
  }
  if (file.size > MAX_NF_BYTES) {
    return { error: "Arquivo muito grande (máx. 5MB)." };
  }
  if (file.type && !ALLOWED_NF.includes(file.type)) {
    return { error: "Envie a NF em PDF ou imagem (PDF, JPG, PNG)." };
  }

  // Recalcula o saldo no servidor (nunca confia no cliente).
  const summary = await getWithdrawalSummary(membership, membership.brand);
  if (!summary.eligible) {
    return {
      error: `O saque libera a partir de ${brl(summary.minSales)} em vendas acumuladas.`,
    };
  }
  if (summary.pending > 0) {
    return { error: "Você já tem um saque em análise." };
  }
  if (summary.available <= 0) {
    return { error: "Sem saldo disponível para saque no momento." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  await prisma.withdrawal.create({
    data: {
      creatorId: membership.id,
      amount: summary.available,
      status: "REQUESTED",
      nfName: file.name || "nota-fiscal",
      nfMime: file.type || "application/octet-stream",
      nfData: bytes,
    },
  });

  revalidatePath(`/painel/${membership.brand.slug}`);
  revalidatePath("/admin", "layout");
  return { ok: true };
}

function brl(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
