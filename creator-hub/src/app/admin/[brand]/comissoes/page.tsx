import { requireBrandAdmin } from "@/lib/admin-brand";
import { buildCommissionReport } from "@/lib/commission-report";
import { resolvePeriod, formatBRL } from "@/lib/format";
import { PeriodFilter } from "@/components/PeriodFilter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default async function ComissoesTab({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
}) {
  const { brand: slug } = await params;
  const { brand } = await requireBrandAdmin(slug);
  const sp = await searchParams;
  const { key: periodKey, since, until } = resolvePeriod(sp.period, sp.from, sp.to);

  const report = await buildCommissionReport(brand, { since, until });

  // Preserva o período no link de export.
  const q = new URLSearchParams();
  if (sp.period) q.set("period", sp.period);
  if (sp.from) q.set("from", sp.from);
  if (sp.to) q.set("to", sp.to);
  const exportHref = `/admin/${brand.slug}/comissoes/export${q.toString() ? "?" + q.toString() : ""}`;

  const withSales = report.rows.filter((r) => r.sales > 0);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Comissões</h1>
        <div className="flex flex-wrap items-center gap-3">
          <PeriodFilter
            basePath={`/admin/${brand.slug}/comissoes`}
            activeKey={periodKey}
            from={sp.from}
            to={sp.to}
            color={brand.primaryColor}
          />
          {report.connected && report.rows.length > 0 && (
            <a href={exportHref} className="btn btn-outline" download>
              Exportar CSV
            </a>
          )}
        </div>
      </div>
      <p className="mb-6 text-sm text-[var(--muted)]">
        Vendas e comissão a pagar por creator, no período. Base: pedidos que usaram
        o cupom de cada creator. Dica: para fechar pagamento, use o período
        <b> Personalizado</b> (ex.: o mês inteiro).
      </p>

      {!report.connected ? (
        <div className="card text-sm text-[var(--muted)]">
          Conecte a Shopify (aba Vendas) para calcular as comissões.
        </div>
      ) : report.error ? (
        <div className="card border-[var(--danger)] bg-[#fdecea] text-sm text-[var(--danger)]">
          {report.error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Vendas no período" value={formatBRL(report.totalSales)} />
            <Stat label="Comissão a pagar" value={formatBRL(report.totalCommission)} />
            <Stat
              label="Creators com venda"
              value={`${withSales.length} de ${report.rows.length}`}
            />
          </div>

          {report.truncated && (
            <div className="card mt-4 border-[var(--warning)] bg-[#fff9ee] text-sm text-[var(--muted)]">
              ⚠️ O período tem muitos pedidos e pode estar <b>truncado</b> (limite de
              varredura). Para pagamento, prefira um período mais curto (ex.: mensal)
              para garantir o total exato.
            </div>
          )}

          <div className="card mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-[var(--muted)]">
                  <th className="py-2 pr-4 font-medium">Creator</th>
                  <th className="py-2 pr-4 font-medium">Cupom</th>
                  <th className="py-2 pr-4 text-right font-medium">Pedidos</th>
                  <th className="py-2 pr-4 text-right font-medium">Vendas</th>
                  <th className="py-2 pr-4 text-right font-medium">%</th>
                  <th className="py-2 text-right font-medium">Comissão a pagar</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((r) => (
                  <tr key={r.code} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{r.name}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{r.code}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{r.orders}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{formatBRL(r.sales)}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{r.ratePct}%</td>
                    <td className="py-2 text-right font-semibold tabular-nums text-[var(--brand)]">
                      {formatBRL(r.commission)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td className="py-3 pr-4 font-bold" colSpan={2}>Total</td>
                  <td className="py-3 pr-4 text-right font-bold tabular-nums">{report.totalOrders}</td>
                  <td className="py-3 pr-4 text-right font-bold tabular-nums">{formatBRL(report.totalSales)}</td>
                  <td className="py-3 pr-4"></td>
                  <td className="py-3 text-right font-bold tabular-nums text-[var(--brand)]">
                    {formatBRL(report.totalCommission)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
