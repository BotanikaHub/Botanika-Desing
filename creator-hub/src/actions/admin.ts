"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { suggestCoupon } from "@/lib/format";
import { createDiscountCode, isShopifyConfigured } from "@/lib/shopify";

async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado.");
  return admin;
}

// Garante um código de cupom único no banco (acrescenta sufixo se já existir)
async function uniqueCouponCode(base: string): Promise<string> {
  let code = suggestCoupon(base);
  let n = 1;
  // limite de segurança
  while (n < 100) {
    const clash = await prisma.creator.findUnique({ where: { couponCode: code } });
    if (!clash) return code;
    n += 1;
    code = `${suggestCoupon(base)}${n}`;
  }
  return `${suggestCoupon(base)}${Date.now().toString().slice(-4)}`;
}

export type ApproveState = { error?: string; ok?: boolean } | null;

export async function approveCreatorAction(
  _prev: ApproveState,
  formData: FormData,
): Promise<ApproveState> {
  await ensureAdmin();

  const id = String(formData.get("creatorId") || "");
  const requestedCode = String(formData.get("couponCode") || "").trim();
  const ratePct = parseFloat(String(formData.get("commissionRate") || "10"));

  const creator = await prisma.creator.findUnique({ where: { id } });
  if (!creator) return { error: "Creator não encontrado." };
  if (creator.status === "APPROVED") return { error: "Creator já aprovado." };

  const rate = isNaN(ratePct) ? 0.1 : Math.max(0, Math.min(ratePct, 100)) / 100;
  const code = await uniqueCouponCode(
    requestedCode || creator.desiredCoupon || creator.instagram || creator.name,
  );

  let shopifyPriceRuleId: string | null = null;
  let shopifyDiscountId: string | null = null;

  if (isShopifyConfigured()) {
    try {
      const created = await createDiscountCode({
        code,
        percentage: rate,
        title: `Afiliado Botanika — ${creator.name}`,
      });
      shopifyPriceRuleId = created.priceRuleId;
      shopifyDiscountId = created.discountId;
    } catch (err) {
      return {
        error: `Falha ao criar cupom na Shopify: ${
          err instanceof Error ? err.message : "erro desconhecido"
        }`,
      };
    }
  }

  await prisma.creator.update({
    where: { id },
    data: {
      status: "APPROVED",
      couponCode: code,
      commissionRate: rate,
      shopifyPriceRuleId,
      shopifyDiscountId,
      approvedAt: new Date(),
      rejectionReason: null,
    },
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function rejectCreatorAction(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("creatorId") || "");
  const reason = String(formData.get("reason") || "").trim() || null;

  await prisma.creator.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: reason },
  });

  revalidatePath("/admin");
}
