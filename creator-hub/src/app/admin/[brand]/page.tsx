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

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function BrandAdmin({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ connected?: string; error?: string; period?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const { brand: slug } = await params;
  const sp = await searchParams;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();
  if (admin.brandId && admin.brandId !== brand.id) redirect("/admin");

  // Período do dashboard
  const periods: { key: string; label: string; days: number | null }[] = [
    { key: "7d", label: "7 dias", days: 7 },
    { key: "30d", label: "30 dias", days: 30 },
    { key: "90d", label: "90 dias", days: 90 },
    { key: "12m", label: "12 meses", days: 365 },
    { key: "all", label: "Tudo", days: null },
  ];
  const period = periods.find((p) => p.key === sp.period) ?? periods[2]; // padrão: 90 dias
  const since = period.days
    ? new Date(Date.now() - period.days * 86400000).toISOString().slice(0, 10)
    : null;

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
      analytics = await getBrandAnalytics(conn, creatorsByCode, { since });
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

        {/* Dashboard */}
        <section className="mb-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Dashboard · {brand.name}</h2>
            {brandView.connected && (
              <div className="flex flex-wrap gap-1.5">
                {periods.map((p) => (
                  <Link
                    key={p.key}
                    href={`/admin/${brand.slug}?period=${p.key}`}
                    className="rounded-full border px-3 py-1 text-xs font-semibold transition"
                    style={
                      p.key === period.key
                        ? { background: brand.primaryColor, color: "#fff", borderColor: brand.primaryColor }
                        : undefined
                    }
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {!brandView.connected ? (
            <div className="card text-sm text-[var(--muted)]">
              Conecte a Shopify desta marca (abaixo) para ver o dashboard de vendas.
            </div>
          ) : analyticsError ? (
            <div className="card border-[var(--danger)] bg-[#fdecea] text-sm text-[var(--danger)]">
              Não foi possível carregar o dashboard: {analyticsError}
            </div>
          ) : analytics ? (
            <BrandAnalyticsView data={analytics} color={brand.primaryColor} />
          ) : null}
        </section>

        {/* Conexão Shopify + import */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">Conexão Shopify</h2>
          <BrandSettings brands={[brandView]} />
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
