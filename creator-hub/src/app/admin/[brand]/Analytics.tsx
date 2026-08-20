import { formatBRL } from "@/lib/format";
import type { BrandAnalytics } from "@/lib/shopify";

export function BrandAnalyticsView({
  data,
  color,
}: {
  data: BrandAnalytics;
  color: string;
}) {
  const maxInfluencerSales = Math.max(
    1,
    ...data.topInfluencers.map((i) => i.sales),
  );
  const maxProductRevenue = Math.max(
    1,
    ...data.topProducts.map((p) => p.revenue),
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Vendas pagas (produtos)" value={formatBRL(data.trackedSales)} />
        <Stat
          label="Pedidos com cupom"
          value={`${data.trackedPaidOrders} pagos de ${data.trackedOrders}`}
        />
        <Stat label="Pedidos analisados" value={String(data.ordersScanned)} />
      </div>

      <div className="space-y-6">
        {/* Top influencers */}
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold">
            🏆 Influencers que mais vendem
          </h3>
          {data.topInfluencers.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              Ainda sem vendas por cupom no período analisado.
            </p>
          ) : (
            <ol className="space-y-3">
              {data.topInfluencers.map((inf, i) => (
                <li key={inf.code}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">
                      {i + 1}. {inf.name}{" "}
                      <span className="font-mono text-xs text-[var(--muted)]">
                        {inf.code}
                      </span>
                    </span>
                    <span className="whitespace-nowrap font-semibold">
                      {formatBRL(inf.sales)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--background)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(inf.sales / maxInfluencerSales) * 100}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    {inf.paidOrders} pago(s) de {inf.orders} · comissão{" "}
                    {formatBRL(inf.commission)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Top produtos */}
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold">
            📦 Produtos mais vendidos (via influencers)
          </h3>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              Ainda sem produtos vendidos por cupom no período.
            </p>
          ) : (
            <ol className="space-y-3">
              {data.topProducts.map((p, i) => (
                <li key={p.title}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">
                      {i + 1}. {p.title}
                    </span>
                    <span className="whitespace-nowrap font-semibold">
                      {formatBRL(p.revenue)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--background)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(p.revenue / maxProductRevenue) * 100}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    {p.quantity} unidade(s)
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
