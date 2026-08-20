import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CopyButton } from "@/components/CopyButton";
import { getCurrentCreatorAccount } from "@/lib/auth";
import { creatorLogoutAction } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { brandConnection } from "@/lib/brand";
import { isShopifyConfigured, type CreatorSales } from "@/lib/shopify";
import { cachedCreatorSales, cachedOrders } from "@/lib/shopify-cache";
import { formatBRL, formatDate, resolvePeriod } from "@/lib/format";
import { requestOrigin } from "@/lib/request";
import { PeriodFilter } from "@/components/PeriodFilter";
import { TermGate } from "./TermGate";
import { GoalCard } from "./GoalCard";

const DEFAULT_TERM_TITLE = "Termo de aceite do Creator Club";
const DEFAULT_TERM_BODY =
  "Ao aceitar, você se torna creator parceiro(a) da marca, com direito ao seu cupom e link exclusivos e à sua comissão sobre as vendas geradas. Você concorda em divulgar de forma honesta, sem promessas enganosas. A parceria pode ser encerrada por qualquer uma das partes a qualquer momento. Seus dados são usados apenas para a operação do programa e envios.";

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

export default async function PainelBrand({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
}) {
  const account = await getCurrentCreatorAccount();
  if (!account) redirect("/entrar");

  const { brand: slug } = await params;
  const sp = await searchParams;
  const { key: periodKey, since, until } = resolvePeriod(sp.period, sp.from, sp.to);
  const membership = account.creators.find(
    (c) => c.brand.slug === slug.toLowerCase() && c.status === "APPROVED" && c.couponCode,
  );
  if (!membership) redirect("/painel");

  const brand = membership.brand;
  const color = brand.primaryColor;
  const couponCode = membership.couponCode as string;
  const rate = membership.commissionRate;
  const discountRate = membership.couponDiscountRate ?? brand.defaultDiscountRate;

  // Gate do termo: enquanto não aceito — ou aceito numa versão antiga do termo —
  // mostra o aceite eletrônico + endereço novamente.
  const acceptedCurrentTerm =
    membership.termsAcceptedAt != null &&
    (membership.termsVersion ?? 0) >= brand.termVersion;
  if (!acceptedCurrentTerm) {
    return (
      <div className="flex min-h-screen flex-col" style={{ ["--brand" as string]: color }}>
        <header className="border-b bg-[var(--surface)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Link href="/painel" className="text-sm text-[var(--muted)] hover:underline">
                ← Meu painel
              </Link>
              <span className="rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: color }}>
                {brand.name}
              </span>
            </div>
            <form action={creatorLogoutAction}>
              <button type="submit" className="btn btn-ghost">Sair</button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
          <TermGate
            brandSlug={brand.slug}
            brandName={brand.name}
            brandColor={color}
            termTitle={brand.termTitle || DEFAULT_TERM_TITLE}
            termBody={brand.termBody || DEFAULT_TERM_BODY}
            defaultName={membership.name || account.name}
          />
        </main>
      </div>
    );
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "") || (await requestOrigin());
  const affiliateLink = `${appUrl}/r/${brand.slug}/${couponCode}`;
  const clicks = await prisma.click.count({ where: { creatorId: membership.id } });

  const conn = brandConnection(brand);
  let sales: CreatorSales | null = null;
  let salesError: string | null = null;
  const connected = isShopifyConfigured(conn);
  if (connected) {
    try {
      sales = await cachedCreatorSales(brand.id, conn, couponCode, { since, until });
    } catch (err) {
      salesError = err instanceof Error ? err.message : "Erro ao consultar a loja.";
    }
  }

  const totalSales = sales?.totalSales ?? 0;
  // A creator vê somente pedidos pagos.
  const paidOrders = sales?.orders.filter((o) => o.paid) ?? [];
  const commission = totalSales * rate;
  const maxProductRevenue = Math.max(1, ...(sales?.topProducts.map((p) => p.revenue) ?? [0]));

  // Gamificação: vendas do período da META (independente do filtro da tela).
  const goalPeriod = brand.goalPeriod === "all" ? "all" : "monthly";
  const goal = membership.goalAmount ?? brand.goalDefaultAmount;
  let goalSales = 0;
  if (connected) {
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const goalSince = goalPeriod === "monthly" ? monthStart : null;
    try {
      const g = await cachedOrders(brand.id, conn, couponCode, { since: goalSince });
      goalSales = g.totalSales;
    } catch {
      goalSales = 0;
    }
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ ["--brand" as string]: color }}>
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Link href="/painel" className="text-sm text-[var(--muted)] hover:underline">
              ← Meu painel
            </Link>
            <span className="rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: color }}>
              {brand.name}
            </span>
          </div>
          <form action={creatorLogoutAction}>
            <button type="submit" className="btn btn-ghost">Sair</button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        {/* Jornada / meta (usa o período da meta, não o filtro da tela) */}
        {connected && (
          <div className="mb-6">
            <GoalCard
              sales={goalSales}
              goal={goal}
              bonusStep={brand.bonusStepAmount}
              bonusLabel={brand.bonusLabel}
              period={goalPeriod}
              color={color}
            />
          </div>
        )}

        <div className="mb-4">
          <PeriodFilter basePath={`/painel/${brand.slug}`} activeKey={periodKey} from={sp.from} to={sp.to} color={color} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Vendas pagas" value={formatBRL(totalSales)} />
          <Stat label="Pedidos pagos" value={String(sales?.paidOrderCount ?? 0)} />
          <Stat label={`Comissão (${Math.round(rate * 100)}%)`} value={formatBRL(commission)} />
          <Stat label="Cliques no link" value={String(clicks)} />
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Consideramos apenas <b>pedidos pagos</b> e a comissão é sobre o{" "}
          <b>valor dos produtos</b> (sem frete).
        </p>

        {salesError && (
          <div className="card mt-6 border-[var(--danger)] bg-[#fdecea] text-sm text-[var(--danger)]">
            Não foi possível carregar as vendas: {salesError}
          </div>
        )}

        {/* Cupom e link */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="card">
            <h3 className="text-sm font-semibold text-[var(--muted)]">Seu cupom de desconto</h3>
            <p className="mt-2 text-2xl font-bold tracking-widest text-[var(--brand)]">{couponCode}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {Math.round(discountRate * 100)}% de desconto para o cliente.
            </p>
            <div className="mt-4">
              <CopyButton value={couponCode} label="Copiar cupom" />
            </div>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-[var(--muted)]">Seu link exclusivo</h3>
            <p className="mt-2 break-all rounded-lg bg-[var(--brand-soft)] px-3 py-2 text-sm">{affiliateLink}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">O cupom é aplicado automaticamente no checkout.</p>
            <div className="mt-4">
              <CopyButton value={affiliateLink} label="Copiar link" />
            </div>
          </div>
        </div>

        {/* Produtos que você mais vende */}
        <div className="card mt-6">
          <h3 className="mb-4 text-lg font-semibold">📦 Produtos que você mais vende</h3>
          {!sales || sales.topProducts.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">Nenhuma venda ainda.</p>
          ) : (
            <ol className="space-y-3">
              {sales.topProducts.map((p, i) => (
                <li key={p.title}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">{i + 1}. {p.title}</span>
                    <span className="font-semibold">{formatBRL(p.revenue)}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--background)]">
                    <div className="h-full rounded-full" style={{ width: `${(p.revenue / maxProductRevenue) * 100}%`, background: color }} />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">{p.quantity} unidade(s)</p>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Pedidos pagos */}
        <div className="card mt-6">
          <h3 className="mb-1 text-lg font-semibold">Pedidos pagos com seu cupom</h3>
          <p className="mb-4 text-xs text-[var(--muted)]">
            Valor = produtos (sem frete). Comissão = {Math.round(rate * 100)}% desse valor.
          </p>
          {paidOrders.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">Nenhum pedido pago ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-[var(--muted)]">
                    <th className="py-2 pr-4 font-medium">Pedido</th>
                    <th className="py-2 pr-4 font-medium">Data</th>
                    <th className="py-2 pr-4 font-medium">Valor (produtos)</th>
                    <th className="py-2 font-medium">Sua comissão</th>
                  </tr>
                </thead>
                <tbody>
                  {paidOrders.map((o) => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{o.name}</td>
                      <td className="py-2 pr-4">{formatDate(o.createdAt)}</td>
                      <td className="py-2 pr-4">{formatBRL(o.subtotal)}</td>
                      <td className="py-2 font-semibold text-[var(--brand)]">{formatBRL(o.subtotal * rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
