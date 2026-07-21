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
  searchProducts,
  searchCollections,
  readDiscountConfigByCode,
  saveDiscountByCode,
  defaultCouponConfig,
  type CouponConfig,
  type PickItem,
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

// ─────────────── Editor de configuração do cupom (Shopify) ───────────────

async function brandConnForAdmin(brandId: string) {
  const admin = await ensureAdmin();
  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!brand) throw new Error("Marca não encontrada.");
  if (admin.brandId && admin.brandId !== brand.id) {
    throw new Error("Sem permissão para esta marca.");
  }
  return { brand, conn: brandConnection(brand) };
}

// Busca produtos/coleções da loja para o seletor do editor.
export async function searchShopifyItemsAction(
  brandId: string,
  kind: "products" | "collections",
  term: string,
): Promise<PickItem[]> {
  const { conn } = await brandConnForAdmin(brandId);
  if (!isShopifyConfigured(conn)) return [];
  try {
    return kind === "products"
      ? await searchProducts(conn, term)
      : await searchCollections(conn, term);
  } catch {
    return [];
  }
}

export type CouponConfigLoad = {
  config: CouponConfig;
  productLabels: PickItem[];
  collectionLabels: PickItem[];
  shopifyOn: boolean;
  found: boolean;
  error?: string;
};

// Lê a configuração atual do cupom na Shopify para pré-preencher o editor.
export async function loadCouponConfigAction(creatorId: string): Promise<CouponConfigLoad> {
  await ensureAdmin();
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
    include: { brand: true },
  });
  if (!creator) throw new Error("Creator não encontrado.");

  const conn = brandConnection(creator.brand);
  const fallback = defaultCouponConfig(
    creator.couponDiscountRate ?? creator.brand.defaultDiscountRate,
  );
  const shopifyOn = isShopifyConfigured(conn);
  if (!shopifyOn || !creator.couponCode) {
    return { config: fallback, productLabels: [], collectionLabels: [], shopifyOn, found: false };
  }

  try {
    const found = await readDiscountConfigByCode(conn, creator.couponCode);
    if (!found || !found.config) {
      return { config: fallback, productLabels: [], collectionLabels: [], shopifyOn, found: false };
    }
    return {
      config: found.config,
      productLabels: found.productLabels,
      collectionLabels: found.collectionLabels,
      shopifyOn,
      found: true,
    };
  } catch (err) {
    return {
      config: fallback,
      productLabels: [],
      collectionLabels: [],
      shopifyOn,
      found: false,
      error: err instanceof Error ? err.message : "Erro ao ler o cupom na Shopify.",
    };
  }
}

function parseCouponConfig(raw: string): CouponConfig {
  const o = JSON.parse(raw) as Partial<CouponConfig>;
  const kind = o.kind === "free_shipping" ? "free_shipping" : "amount";
  const valueType = o.valueType === "fixed" ? "fixed" : "percentage";
  const appliesTo =
    o.appliesTo === "products" || o.appliesTo === "collections" ? o.appliesTo : "order";
  const num = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : 0);
  return {
    kind,
    valueType,
    // percentage chega como % inteiro (5) → fração; fixed em R$.
    value: valueType === "percentage" ? Math.max(0, Math.min(num(o.value), 100)) / 100 : Math.max(0, num(o.value)),
    appliesTo,
    productIds: Array.isArray(o.productIds) ? o.productIds.filter((x) => typeof x === "string") : [],
    collectionIds: Array.isArray(o.collectionIds) ? o.collectionIds.filter((x) => typeof x === "string") : [],
    minSubtotal: o.minSubtotal != null && num(o.minSubtotal) > 0 ? num(o.minSubtotal) : null,
    usageLimit: o.usageLimit != null && num(o.usageLimit) > 0 ? Math.round(num(o.usageLimit)) : null,
    oncePerCustomer: Boolean(o.oncePerCustomer),
  };
}

// Grava a configuração completa do cupom na Shopify (cria/substitui) e espelha no banco.
export async function saveCouponConfigAction(
  _prev: ApproveState,
  formData: FormData,
): Promise<ApproveState> {
  await ensureAdmin();

  const id = String(formData.get("creatorId") || "");
  const raw = String(formData.get("couponConfig") || "");
  const creator = await prisma.creator.findUnique({
    where: { id },
    include: { brand: true },
  });
  if (!creator) return { error: "Creator não encontrado." };
  if (!creator.couponCode) return { error: "Defina o código do cupom primeiro." };

  const conn = brandConnection(creator.brand);
  if (!isShopifyConfigured(conn)) {
    return { error: "Conecte a Shopify desta marca primeiro." };
  }

  let config: CouponConfig;
  try {
    config = parseCouponConfig(raw);
  } catch {
    return { error: "Configuração inválida." };
  }
  if (config.appliesTo === "products" && config.productIds.length === 0) {
    return { error: "Selecione ao menos um produto." };
  }
  if (config.appliesTo === "collections" && config.collectionIds.length === 0) {
    return { error: "Selecione ao menos uma coleção." };
  }

  let discountId: string;
  try {
    discountId = await saveDiscountByCode(conn, {
      code: creator.couponCode,
      title: `Creator ${creator.brand.name} — ${creator.name}`,
      config,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao salvar o cupom na Shopify." };
  }

  await prisma.creator.update({
    where: { id },
    data: {
      couponConfig: config as unknown as Prisma.InputJsonValue,
      // Mantém o % para exibições rápidas; nulo quando não é percentual.
      couponDiscountRate:
        config.kind === "amount" && config.valueType === "percentage" ? config.value : null,
      shopifyDiscountId: discountId || creator.shopifyDiscountId,
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
  const rate = parseRate(String(formData.get("commissionRate") || ""));
  const linkExisting = formData.get("linkExisting") === "on";

  const creator = await prisma.creator.findUnique({
    where: { id },
    include: { brand: true },
  });
  if (!creator) return { error: "Creator não encontrado." };

  // A edição rápida cuida da comissão (interna) e de qual cupom rastrear.
  // O valor/onde-aplica do cupom vive no editor de configuração (Shopify).
  let result: CouponResult;
  try {
    result = await resolveCoupon(creator, { requestedCode, discount: null, linkExisting });
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
