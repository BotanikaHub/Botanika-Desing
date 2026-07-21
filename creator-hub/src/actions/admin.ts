"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { suggestCoupon } from "@/lib/format";
import crypto from "crypto";
import {
  createDiscountCode,
  isShopifyConfigured,
  listDiscountCodes,
} from "@/lib/shopify";
import { brandConnection } from "@/lib/brand";
import type { Prisma } from "@prisma/client";

async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado.");
  return admin;
}

// Garante um código de cupom único no banco (globalmente).
async function uniqueCouponCode(base: string): Promise<string> {
  let code = suggestCoupon(base);
  let n = 1;
  while (n < 100) {
    const clash = await prisma.creator.findUnique({ where: { couponCode: code } });
    if (!clash) return code;
    n += 1;
    code = `${suggestCoupon(base)}${n}`;
  }
  return `${suggestCoupon(base)}${Date.now().toString().slice(-4)}`;
}

export type ApproveState = { error?: string; ok?: boolean } | null;

type CreatorWithBrand = Prisma.CreatorGetPayload<{ include: { brand: true } }>;

type CouponResult = {
  code: string;
  shopifyPriceRuleId: string | null;
  shopifyDiscountId: string | null;
};

/**
 * Resolve o cupom de um creator:
 *  - linkExisting = true  → apenas VINCULA um cupom que já existe na Shopify
 *    (não cria nada; o painel puxa as vendas por esse código). Usa o código
 *    exatamente como digitado.
 *  - linkExisting = false → CRIA um cupom novo na Shopify (código único).
 */
async function resolveCoupon(
  creator: CreatorWithBrand,
  opts: { requestedCode: string; rate: number; linkExisting: boolean },
): Promise<CouponResult> {
  if (opts.linkExisting) {
    const exact = opts.requestedCode.trim().toUpperCase();
    if (!exact) throw new Error("Informe o código do cupom já existente.");
    const clash = await prisma.creator.findUnique({
      where: { couponCode: exact },
    });
    if (clash && clash.id !== creator.id) {
      throw new Error("Esse cupom já está vinculado a outro creator.");
    }
    // Cupom já existe na Shopify — não temos os IDs dele, e não precisamos.
    return { code: exact, shopifyPriceRuleId: null, shopifyDiscountId: null };
  }

  const code = await uniqueCouponCode(
    opts.requestedCode || creator.desiredCoupon || creator.instagram || creator.name,
  );
  const conn = brandConnection(creator.brand);
  if (isShopifyConfigured(conn)) {
    const created = await createDiscountCode(conn, {
      code,
      percentage: opts.rate,
      title: `Afiliado ${creator.brand.name} — ${creator.name}`,
    });
    return {
      code: created.code || code,
      shopifyPriceRuleId: created.priceRuleId,
      shopifyDiscountId: created.discountId,
    };
  }
  return { code, shopifyPriceRuleId: null, shopifyDiscountId: null };
}

function parseRate(raw: string): number {
  const pct = parseFloat(raw || "10");
  return isNaN(pct) ? 0.1 : Math.max(0, Math.min(pct, 100)) / 100;
}

export async function approveCreatorAction(
  _prev: ApproveState,
  formData: FormData,
): Promise<ApproveState> {
  await ensureAdmin();

  const id = String(formData.get("creatorId") || "");
  const requestedCode = String(formData.get("couponCode") || "").trim();
  const rate = parseRate(String(formData.get("commissionRate") || "10"));
  const linkExisting = formData.get("linkExisting") === "on";

  const creator = await prisma.creator.findUnique({
    where: { id },
    include: { brand: true },
  });
  if (!creator) return { error: "Creator não encontrado." };
  if (creator.status === "APPROVED") return { error: "Creator já aprovado." };

  let result: CouponResult;
  try {
    result = await resolveCoupon(creator, { requestedCode, rate, linkExisting });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao definir o cupom." };
  }

  await prisma.creator.update({
    where: { id },
    data: {
      status: "APPROVED",
      couponCode: result.code,
      commissionRate: rate,
      shopifyPriceRuleId: result.shopifyPriceRuleId,
      shopifyDiscountId: result.shopifyDiscountId,
      approvedAt: new Date(),
      rejectionReason: null,
    },
  });

  revalidatePath("/admin", "layout");
  return { ok: true };
}

// Edita o cupom / comissão de um creator JÁ APROVADO (trocar código, vincular
// um cupom existente, ou ajustar a %).
export async function editCreatorCouponAction(
  _prev: ApproveState,
  formData: FormData,
): Promise<ApproveState> {
  await ensureAdmin();

  const id = String(formData.get("creatorId") || "");
  const requestedCode = String(formData.get("couponCode") || "").trim();
  const rate = parseRate(String(formData.get("commissionRate") || "10"));
  const linkExisting = formData.get("linkExisting") === "on";

  const creator = await prisma.creator.findUnique({
    where: { id },
    include: { brand: true },
  });
  if (!creator) return { error: "Creator não encontrado." };

  let result: CouponResult;
  try {
    result = await resolveCoupon(creator, { requestedCode, rate, linkExisting });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao definir o cupom." };
  }

  await prisma.creator.update({
    where: { id },
    data: {
      status: "APPROVED",
      couponCode: result.code,
      commissionRate: rate,
      shopifyPriceRuleId: result.shopifyPriceRuleId,
      shopifyDiscountId: result.shopifyDiscountId,
      approvedAt: creator.approvedAt || new Date(),
    },
  });

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export type BrandConfigState = { error?: string; ok?: boolean } | null;

// Salva as credenciais Shopify (Client ID/Secret + domínio) de uma marca.
export async function saveBrandShopifyConfigAction(
  _prev: BrandConfigState,
  formData: FormData,
): Promise<BrandConfigState> {
  const admin = await ensureAdmin();

  const brandId = String(formData.get("brandId") || "");
  const shopDomain = String(formData.get("shopDomain") || "").trim().toLowerCase() || null;
  const storeUrl = String(formData.get("storeUrl") || "").trim() || null;
  const apiKey = String(formData.get("shopifyApiKey") || "").trim() || null;
  const apiSecretRaw = String(formData.get("shopifyApiSecret") || "").trim();

  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!brand) return { error: "Marca não encontrada." };
  if (admin.brandId && admin.brandId !== brand.id) {
    return { error: "Sem permissão para esta marca." };
  }

  await prisma.brand.update({
    where: { id: brandId },
    data: {
      shopDomain,
      storeUrl,
      shopifyApiKey: apiKey,
      // só sobrescreve o secret se um novo valor foi enviado (mantém o atual em branco)
      ...(apiSecretRaw ? { shopifyApiSecret: apiSecretRaw } : {}),
    },
  });

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export type ImportState = {
  error?: string;
  imported?: number;
  skipped?: number;
} | null;

// Importa todos os cupons ATIVOS da loja Shopify da marca como afiliados
// aprovados "não reivindicados" (a influencer assume o painel depois).
export async function importShopifyCouponsAction(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const admin = await ensureAdmin();

  const brandId = String(formData.get("brandId") || "");
  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!brand) return { error: "Marca não encontrada." };
  if (admin.brandId && admin.brandId !== brand.id) {
    return { error: "Sem permissão para esta marca." };
  }

  const conn = brandConnection(brand);
  if (!isShopifyConfigured(conn)) {
    return { error: "Conecte a Shopify desta marca primeiro." };
  }

  let discounts;
  try {
    discounts = await listDiscountCodes(conn);
  } catch (err) {
    return {
      error: `Falha ao listar cupons da Shopify: ${
        err instanceof Error ? err.message : "erro desconhecido"
      }`,
    };
  }

  const active = discounts.filter((d) => d.status === "ACTIVE");
  const codes = active.map((d) => d.code.toUpperCase());

  const existing = await prisma.creator.findMany({
    where: { couponCode: { in: codes } },
    select: { couponCode: true },
  });
  const existingSet = new Set(existing.map((e) => e.couponCode));

  const toCreate = active
    .filter((d) => !existingSet.has(d.code.toUpperCase()))
    .map((d) => {
      const code = d.code.toUpperCase();
      return {
        brandId: brand.id,
        status: "APPROVED" as const,
        source: "shopify_import",
        claimed: false,
        name: d.title && d.title !== d.code ? d.title : code,
        // e-mail sintético (não utilizável) até a influencer reivindicar
        email: `${code.toLowerCase()}@import.creatorclub`,
        // hash não-bcrypt: login sempre falha até reivindicar e definir senha
        passwordHash: `unclaimed:${crypto.randomBytes(16).toString("hex")}`,
        couponCode: code,
        desiredCoupon: code,
        commissionRate: d.percentage ?? brand.defaultCommissionRate,
        approvedAt: new Date(),
      };
    });

  if (toCreate.length > 0) {
    await prisma.creator.createMany({ data: toCreate, skipDuplicates: true });
  }

  revalidatePath("/admin", "layout");
  return { imported: toCreate.length, skipped: active.length - toCreate.length };
}

export async function rejectCreatorAction(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("creatorId") || "");
  const reason = String(formData.get("reason") || "").trim() || null;

  await prisma.creator.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: reason },
  });

  revalidatePath("/admin", "layout");
}
