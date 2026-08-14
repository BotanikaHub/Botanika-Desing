import { prisma } from "@/lib/prisma";
import { brandConnection } from "@/lib/brand";
import { requireBrandAdmin } from "@/lib/admin-brand";
import {
  isShopifyConfigured,
  type BrandAnalytics,
} from "@/lib/shopify";
import { cachedBrandAnalytics } from "@/lib/shopify-cache";
import { BrandSettings, type BrandView } from "../BrandSettings";
import { BrandAnalyticsView } from "./Analytics";
import { resolvePeriod } from "@/lib/format";
import { PeriodFilter } from "@/components/PeriodFilter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function VendasTab({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{
    connected?: string;
    error?: string;
    period?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const { brand: slug } = await params;
  const { brand } = await requireBrandAdmin(slug);
  const sp = await searchParams;

  const { key: periodKey, since, until } = resolvePeriod(sp.period, sp.from, sp.to);

  const approved = await prisma.creator.findMany({
    where: { brandId: brand.id, status: "APPROVED" },
    select: { name: true, couponCode: true, commissionRate: true },
  });

  const conn = brandConnection(brand);
  let analytics: BrandAnalytics | null = null;
  let analyticsError: string | null = null;
  const connected = isShopifyConfigured(conn);
  if (connected) {
    const creatorsByCode: Record<string, { name: string; rate: number }> = {};
    for (const c of approved) {
      if (c.couponCode) {
        creatorsByCode[c.couponCode.toUpperCase()] = { name: c.name, rate: c.commissionRate };
      }
    }
    try {
      analytics = await cachedBrandAnalytics(brand.id, conn, creatorsByCode, { since, until });
    } catch (err) {
      analyticsError = err instanceof Error ? err.message : "Erro ao analisar vendas.";
    }
  }

  const brandView: BrandView = {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    color: brand.primaryColor,
    shopDomain: brand.shopDomain,
    storeUrl: brand.storeUrl,
    shopifyApiKey: brand.shopifyApiKey,
    hasSecret: Boolean(brand.shopifyApiSecret),
    connected: Boolean(brand.shopifyAccessToken),
    emailFrom: brand.emailFrom,
  };

  return (
    <>
      {sp.connected && (
        <div className="mb-6 rounded-lg border border-[var(--success)] bg-[var(--brand-soft)] px-4 py-3 text-sm text-[var(--brand-dark)]">
          Shopify conectada com sucesso! 🎉
        </div>
      )}
      {sp.error && (
        <div className="mb-6 rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-3 text-sm text-[var(--danger)]">
          Não foi possível conectar: {decodeURIComponent(sp.error)}
        </div>
      )}

      {/* Conexão Shopify */}
      <section className="mb-10">
        <h1 className="mb-4 text-2xl font-bold">Conexão &amp; vendas</h1>
        <BrandSettings brands={[brandView]} />
      </section>

      {/* Vendas */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Vendas</h2>
          {brandView.connected && (
            <PeriodFilter
              basePath={`/admin/${brand.slug}`}
              activeKey={periodKey}
              from={sp.from}
              to={sp.to}
              color={brand.primaryColor}
            />
          )}
        </div>
        {!brandView.connected ? (
          <div className="card text-sm text-[var(--muted)]">
            Conecte a Shopify desta marca (acima) para ver as vendas.
          </div>
        ) : analyticsError ? (
          <div className="card border-[var(--danger)] bg-[#fdecea] text-sm text-[var(--danger)]">
            Não foi possível carregar as vendas: {analyticsError}
          </div>
        ) : analytics ? (
          <BrandAnalyticsView data={analytics} color={brand.primaryColor} />
        ) : null}
      </section>
    </>
  );
}
