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
  setDiscountPercentageByCode,
} from "@/lib/shopify";
import { brandConnection } from "@/lib/brand";
import { sendEmail, creatorApprovedEmail, brandEmailFrom } from "@/lib/email";
import type { Prisma } from "@prisma/client";

function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");
}

async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado.");
  return admin;
}

// Garante um código de cupom único DENTRO DA MARCA.
async function uniqueCouponCode(base: string, brandId: string): Promise<string> {
  let code = suggestCoupon(base);
  let n = 1;
  while (n < 100) {
    const clash = await prisma.creator.findFirst({
      where: { brandId, couponCode: code },
    });
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
  // Desconto do cupom efetivamente aplicado (fração) ou null quando não mexemos.
  discountRate: number | null;
  shopifyPriceRuleId: string | null;
  shopifyDiscountId: string | null;
};

/**
 * Resolve o cupom de um creator. `discount` é o % de DESCONTO do cliente
 * (fração) — separado da comissão. Se null, o desconto na Shopify não é tocado.
 *
 *  - linkExisting = true  → apenas VINCULA um cupom que já existe na Shopify.
 *    Se `discount` foi informado, atualiza o desconto desse cupom na loja.
 *  - linkExisting = false → CRIA um cupom novo na Shopify com o desconto dado
 *    (ou o padrão da marca).
 */
async function resolveCoupon(
  creator: CreatorWithBrand,
  opts: { requestedCode: string; discount: number | null; linkExisting: boolean },
): Promise<CouponResult> {
  const conn = brandConnection(creator.brand);
  const shopifyOn = isShopifyConfigured(conn);

  if (opts.linkExisting) {
    const exact = opts.requestedCode.trim().toUpperCase();
    if (!exact) throw new Error("Informe o código do cupom já existente.");
    const clash = await prisma.creator.findFirst({
      where: { brandId: creator.brandId, couponCode: exact },
    });
    if (clash && clash.id !== creator.id) {
      throw new Error("Esse cupom já está vinculado a outro creator desta marca.");
    }
    // Se o admin definiu um desconto, espelha na Shopify (cupom criado ou importado).
    if (opts.discount != null && shopifyOn) {
      await setDiscountPercentageByCode(conn, exact, opts.discount);
    }
    return {
      code: exact,
      discountRate: opts.discount,
      shopifyPriceRuleId: creator.shopifyPriceRuleId,
      shopifyDiscountId: creator.shopifyDiscountId,
    };
  }

  const code = await uniqueCouponCode(
    opts.requestedCode || creator.desiredCoupon || creator.instagram || creator.name,
    creator.brandId,
  );
  const discount = opts.discount ?? creator.brand.defaultDiscountRate;
  if (shopifyOn) {
    const created = await createDiscountCode(conn, {
      code,
      percentage: discount,
      title: `Creator ${creator.brand.name} — ${creator.name}`,
    });
    return {
      code: created.code || code,
      discountRate: discount,
      shopifyPriceRuleId: created.priceRuleId,
      shopifyDiscountId: created.discountId,
    };
  }
  return { code, discountRate: discount, shopifyPriceRuleId: null, shopifyDiscountId: null };
}

// Comissão: sempre tem um valor (padrão 15% se em branco).
function parseRate(raw: string): number {
  const pct = parseFloat(raw || "15");
  return isNaN(pct) ? 0.15 : Math.max(0, Math.min(pct, 100)) / 100;
}

// Desconto do cupom: opcional. Em branco = não mexer (retorna null).
function parseOptionalRate(raw: string): number | null {
  const t = (raw || "").trim();
  if (t === "") return null;
  const pct = parseFloat(t);
  if (isNaN(pct)) return null;
  return Math.max(0, Math.min(pct, 100)) / 100;
}

export async function approveCreatorAction(
  _prev: ApproveState,
  formData: FormData,
): Promise<ApproveState> {
  await ensureAdmin();

  const id = String(formData.get("creatorId") || "");
  const requestedCode = String(formData.get("couponCode") || "").trim();
  const rate = parseRate(String(formData.get("commissionRate") || ""));
  const discount = parseOptionalRate(String(formData.get("discountRate") || ""));
  const linkExisting = formData.get("linkExisting") === "on";

  const creator = await prisma.creator.findUnique({
    where: { id },
    include: { brand: true },
  });
  if (!creator) return { error: "Creator não encontrado." };
  if (creator.status === "APPROVED") return { error: "Creator já aprovado." };

  let result: CouponResult;
  try {
    result = await resolveCoupon(creator, { requestedCode, discount, linkExisting });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao definir o cupom." };
  }

  await prisma.creator.update({
    where: { id },
    data: {
      status: "APPROVED",
      couponCode: result.code,
      commissionRate: rate,
      ...(result.discountRate != null ? { couponDiscountRate: result.discountRate } : {}),
      shopifyPriceRuleId: result.shopifyPriceRuleId,
      shopifyDiscountId: result.shopifyDiscountId,
      approvedAt: new Date(),
      rejectionReason: null,
    },
  });

  // E-mail de boas-vindas (não bloqueia a aprovação; no-op se e-mail não
  // configurado ou se for um creator importado sem e-mail real).
  const tmpl = creatorApprovedEmail({
    brandName: creator.brand.name,
    brandColor: creator.brand.primaryColor,
    creatorName: creator.name,
    couponCode: result.code,
    ratePct: Math.round(rate * 100),
    loginUrl: `${appUrl()}/entrar`,
  });
  await sendEmail({
    to: creator.email,
    from: brandEmailFrom(creator.brand),
    subject: tmpl.subject,
    html: tmpl.html,
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
  const rate = parseRate(String(formData.get("commissionRate") || ""));
  const discount = parseOptionalRate(String(formData.get("discountRate") || ""));
  const linkExisting = formData.get("linkExisting") === "on";

  const creator = await prisma.creator.findUnique({
    where: { id },
    include: { brand: true },
  });
  if (!creator) return { error: "Creator não encontrado." };

  let result: CouponResult;
  try {
    result = await resolveCoupon(creator, { requestedCode, discount, linkExisting });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao definir o cupom." };
  }

  await prisma.creator.update({
    where: { id },
    data: {
      status: "APPROVED",
      couponCode: result.code,
      commissionRate: rate,
      // Só mexe no desconto salvo quando o admin informou um valor.
      ...(result.discountRate != null ? { couponDiscountRate: result.discountRate } : {}),
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
  const emailFrom = String(formData.get("emailFrom") || "").trim() || null;

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
      emailFrom,
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
  updated?: number;
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
    where: { brandId: brand.id, couponCode: { in: codes } },
    select: { id: true, couponCode: true, couponDiscountRate: true },
  });
  const existingSet = new Set(existing.map((e) => e.couponCode));

  // Backfill: cupons já importados/vinculados que ainda não têm o desconto
  // registrado recebem o valor real vindo da Shopify (sem alterar a loja).
  const pctByCode = new Map(active.map((d) => [d.code.toUpperCase(), d.percentage]));
  let backfilled = 0;
  for (const e of existing) {
    if (e.couponDiscountRate != null || !e.couponCode) continue;
    const pct = pctByCode.get(e.couponCode);
    if (pct == null) continue;
    await prisma.creator.update({
      where: { id: e.id },
      data: { couponDiscountRate: pct },
    });
    backfilled += 1;
  }

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
        // Comissão padrão da marca (interna); o % do cupom vem da Shopify.
        commissionRate: brand.defaultCommissionRate,
        couponDiscountRate: d.percentage ?? null,
        approvedAt: new Date(),
      };
    });

  if (toCreate.length > 0) {
    await prisma.creator.createMany({ data: toCreate, skipDuplicates: true });
  }

  revalidatePath("/admin", "layout");
  return {
    imported: toCreate.length,
    skipped: active.length - toCreate.length,
    updated: backfilled,
  };
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
