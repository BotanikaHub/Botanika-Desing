import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getCurrentAdmin } from "@/lib/auth";
import { adminLogoutAction } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { getBrandBySlug, brandConnection } from "@/lib/brand";
import {
  getBrandAnalytics,
  isShopifyConfigured,
  type BrandAnalytics,
} from "@/lib/shopify";
import {
  PendingCard,
  ApprovedCard,
  type CreatorView,
  type ApprovedView,
} from "../ApplicationCard";
import { BrandSettings, type BrandView } from "../BrandSettings";
import { BrandAnalyticsView } from "./Analytics";
import { resolvePeriod } from "@/lib/format";
import { PeriodFilter } from "@/components/PeriodFilter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function BrandAdmin({
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
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const { brand: slug } = await params;
  const sp = await searchParams;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();
  if (admin.brandId && admin.brandId !== brand.id) redirect("/admin");

  // Período do dashboard
  const { key: periodKey, since, until } = resolvePeriod(sp.period, sp.from, sp.to);

  const [pending, approved, rejected] = await Promise.all([
    prisma.creator.findMany({
      where: { brandId: brand.id, status: "PENDING" },
      orderBy: { createdAt: "asc" },
    }),
    prisma.creator.findMany({
      where: { brandId: brand.id, status: "APPROVED" },
      orderBy: [{ claimed: "asc" }, { approvedAt: "desc" }],
    }),
    prisma.creator.findMany({
      where: { brandId: brand.id, status: "REJECTED" },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  // Analytics (top influencers + top produtos) — a partir dos cupons dos aprovados
  const conn = brandConnection(brand);
  let analytics: BrandAnalytics | null = null;
  let analyticsError: string | null = null;
  if (isShopifyConfigured(conn)) {
    const creatorsByCode: Record<string, { name: string; rate: number }> = {};
    for (const c of approved) {
      if (c.couponCode) {
        creatorsByCode[c.couponCode.toUpperCase()] = {
          name: c.name,
          rate: c.commissionRate,
        };
      }
    }
    try {
      analytics = await getBrandAnalytics(conn, creatorsByCode, { since, until });
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
  };

  const toPending = (c: (typeof pending)[number]): CreatorView => ({
    id: c.id,
    brandName: brand.name,
    brandColor: brand.primaryColor,
    name: c.name,
    email: c.email,
    phone: c.phone,
    instagram: c.instagram,
    tiktok: c.tiktok,
    followers: c.followers,
    niche: c.niche,
    profession: c.profession,
    city: c.city,
    pitch: c.pitch,
    desiredCoupon: c.desiredCoupon,
    defaultRatePct: Math.round(brand.defaultCommissionRate * 100),
  });

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ ["--brand" as string]: brand.primaryColor }}
    >
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-[var(--muted)] hover:underline">
              ← Marcas
            </Link>
            <span
              className="rounded-full px-3 py-1 text-sm font-bold text-white"
              style={{ background: brand.primaryColor }}
            >
              {brand.name}
            </span>
            <span className="badge badge-approved">Admin</span>
          </div>
          <form action={adminLogoutAction}>
            <button type="submit" className="btn btn-ghost">Sair</button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
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

        {/* Título da área */}
        <h1 className="mb-6 text-2xl font-bold">Dashboard · {brand.name}</h1>

        {/* Conexão Shopify + import (compacta, no topo) */}
        <section className="mb-10">
          <BrandSettings brands={[brandView]} />
        </section>

        {/* Vendas */}
        <section className="mb-10">
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

        {/* Pendentes */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">
            Cadastros pendentes <span className="text-[var(--muted)]">({pending.length})</span>
          </h2>
          {pending.length === 0 ? (
            <div className="card text-sm text-[var(--muted)]">Nenhum cadastro pendente.</div>
          ) : (
            <div className="space-y-4">
              {pending.map((c) => (
                <PendingCard key={c.id} creator={toPending(c)} />
              ))}
            </div>
          )}
        </section>

        {/* Aprovados */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">
            Afiliados <span className="text-[var(--muted)]">({approved.length})</span>
          </h2>
          {approved.length === 0 ? (
            <div className="card text-sm text-[var(--muted)]">Nenhum afiliado ainda.</div>
          ) : (
            <div className="space-y-3">
              {approved.map((c) => (
                <ApprovedCard
                  key={c.id}
                  creator={
                    {
                      id: c.id,
                      brandName: brand.name,
                      brandColor: brand.primaryColor,
                      name: c.name,
                      email: c.email,
                      couponCode: c.couponCode,
                      commissionRatePct: Math.round(c.commissionRate * 100),
                      approvedAt: c.approvedAt ? c.approvedAt.toISOString() : null,
                      claimed: c.claimed,
                    } satisfies ApprovedView
                  }
                />
              ))}
            </div>
          )}
        </section>

        {rejected.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold">
              Recusados <span className="text-[var(--muted)]">({rejected.length})</span>
            </h2>
            <div className="card space-y-2 text-sm">
              {rejected.map((c) => (
                <div key={c.id} className="flex justify-between border-b pb-2 last:border-0 last:pb-0">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-[var(--muted)]">
                    {c.rejectionReason || "Sem motivo informado"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
