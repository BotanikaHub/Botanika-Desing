import { prisma } from "@/lib/prisma";
import { brandConnection } from "@/lib/brand";
import { requireBrandAdmin } from "@/lib/admin-brand";
import { isShopifyConfigured } from "@/lib/shopify";
import { cachedBrandAnalytics } from "@/lib/shopify-cache";
import { ProgramSettings, type ProgramView } from "../../ProgramSettings";
import { formatBRL } from "@/lib/format";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function MetasTab({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const { brand } = await requireBrandAdmin(slug);

  const goalPeriod = brand.goalPeriod === "all" ? "all" : "monthly";
  const color = brand.primaryColor;

  const programView: ProgramView = {
    id: brand.id,
    color,
    termTitle: brand.termTitle,
    termBody: brand.termBody,
    goalPeriod: brand.goalPeriod,
    goalDefaultAmount: brand.goalDefaultAmount,
    bonusStepAmount: brand.bonusStepAmount,
    bonusLabel: brand.bonusLabel,
  };

  const approved = await prisma.creator.findMany({
    where: { brandId: brand.id, status: "APPROVED", couponCode: { not: null } },
    select: { name: true, couponCode: true, goalAmount: true, commissionRate: true },
  });

  const conn = brandConnection(brand);
  const connected = isShopifyConfigured(conn);

  // Vendas do período da meta por cupom.
  let salesByCode: Record<
    string,
    { orders: number; paidOrders: number; sales: number; paidSales: number }
  > = {};
  let error: string | null = null;
  if (connected && approved.length > 0) {
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const since = goalPeriod === "monthly" ? monthStart : null;
    const creatorsByCode: Record<string, { name: string; rate: number }> = {};
    for (const c of approved) {
      if (c.couponCode) creatorsByCode[c.couponCode.toUpperCase()] = { name: c.name, rate: c.commissionRate };
    }
    try {
      const a = await cachedBrandAnalytics(brand.id, conn, creatorsByCode, { since });
      salesByCode = a.salesByCode;
    } catch (err) {
      error = err instanceof Error ? err.message : "Erro ao carregar metas.";
    }
  }

  const rows = approved
    .map((c) => {
      // Meta medida sobre vendas pagas (valor dos produtos).
      const sales = salesByCode[(c.couponCode || "").toUpperCase()]?.paidSales ?? 0;
      const goal = c.goalAmount ?? brand.goalDefaultAmount;
      // Sem meta definida (goal ≤ 0): considera atingida (nada a bater).
      const pct = goal > 0 ? (sales / goal) * 100 : 100;
      const reached = goal <= 0 || sales >= goal;
      const bonuses =
        brand.bonusStepAmount > 0 ? Math.floor(Math.max(0, sales - goal) / brand.bonusStepAmount) : 0;
      return { name: c.name, code: c.couponCode || "", sales, goal, pct, reached, bonuses };
    })
    .sort((a, b) => b.pct - a.pct);

  const hit = rows.filter((r) => r.reached).length;
  const whenLabel = goalPeriod === "monthly" ? "este mês" : "no total";

  return (
    <>
      <section className="mb-10">
        <h1 className="mb-1 text-2xl font-bold">Metas</h1>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Configure a meta e o bônus da marca, e acompanhe quem está batendo a meta
          ({whenLabel}).
        </p>
        <ProgramSettings brand={programView} />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold">Desempenho das metas</h2>
          {connected && rows.length > 0 && (
            <span className="text-sm text-[var(--muted)]">
              <b style={{ color }}>{hit}</b> de {rows.length} bateram a meta {whenLabel}
            </span>
          )}
        </div>

        {!connected ? (
          <div className="card text-sm text-[var(--muted)]">
            Conecte a Shopify (aba Vendas) para acompanhar o desempenho das metas.
          </div>
        ) : error ? (
          <div className="card border-[var(--danger)] bg-[#fdecea] text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : rows.length === 0 ? (
          <div className="card text-sm text-[var(--muted)]">Nenhum creator com cupom ainda.</div>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.code} className="card">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{r.name}</span>
                    <span className="font-mono text-xs text-[var(--muted)]">{r.code}</span>
                    {r.reached && (
                      <span className="badge badge-approved">Meta batida ✓</span>
                    )}
                    {r.bonuses > 0 && (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                        style={{ background: color }}
                      >
                        {r.bonuses} bônus
                      </span>
                    )}
                  </div>
                  <span className="text-sm">
                    <b>{formatBRL(r.sales)}</b>{" "}
                    <span className="text-[var(--muted)]">/ {formatBRL(r.goal)}</span>
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--background)]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(100, r.pct)}%`, background: color }}
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {r.reached
                    ? `${Math.round(r.pct)}% da meta`
                    : `${Math.round(r.pct)}% — faltam ${formatBRL(Math.max(0, r.goal - r.sales))}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
