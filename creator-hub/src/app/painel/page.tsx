import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getCurrentCreatorAccount } from "@/lib/auth";
import { creatorLogoutAction } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { brandConnection } from "@/lib/brand";
import { getOrdersByDiscountCode, isShopifyConfigured } from "@/lib/shopify";
import { formatBRL } from "@/lib/format";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const metadata = { title: "Meu painel · Creator Club" };

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default async function PainelPage() {
  const account = await getCurrentCreatorAccount();
  if (!account) redirect("/entrar");

  const active = account.creators.filter(
    (c) => c.status === "APPROVED" && c.couponCode,
  );
  const pending = account.creators.filter((c) => c.status === "PENDING");

  const perBrand = await Promise.all(
    active.map(async (c) => {
      const conn = brandConnection(c.brand);
      let sales = 0;
      let orders = 0;
      if (isShopifyConfigured(conn) && c.couponCode) {
        try {
          const s = await getOrdersByDiscountCode(conn, c.couponCode);
          sales = s.totalSales;
          orders = s.orderCount;
        } catch {
          // ignora falha pontual de uma marca
        }
      }
      const clicks = await prisma.click.count({ where: { creatorId: c.id } });
      return {
        creatorId: c.id,
        brandName: c.brand.name,
        brandSlug: c.brand.slug,
        brandColor: c.brand.primaryColor,
        couponCode: c.couponCode as string,
        rate: c.commissionRate,
        sales,
        orders,
        commission: sales * c.commissionRate,
        clicks,
      };
    }),
  );

  const totalSales = perBrand.reduce((a, b) => a + b.sales, 0);
  const totalOrders = perBrand.reduce((a, b) => a + b.orders, 0);
  const totalCommission = perBrand.reduce((a, b) => a + b.commission, 0);
  const totalClicks = perBrand.reduce((a, b) => a + b.clicks, 0);
  const ranking = [...perBrand].sort((a, b) => b.sales - a.sales);
  const maxSales = Math.max(1, ...ranking.map((r) => r.sales));

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Logo />
          <form action={creatorLogoutAction}>
            <button type="submit" className="btn btn-ghost">Sair</button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        <h1 className="text-2xl font-bold">
          Olá, {account.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Seu resumo em todas as marcas que você divulga.
        </p>

        {/* Consolidado */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Vendas totais" value={formatBRL(totalSales)} />
          <Stat label="Pedidos" value={String(totalOrders)} />
          <Stat label="Comissão total" value={formatBRL(totalCommission)} />
          <Stat label="Cliques" value={String(totalClicks)} />
        </div>

        {/* Ranking de empresas */}
        {ranking.length > 0 && (
          <div className="card mt-6">
            <h2 className="mb-4 text-lg font-semibold">🏆 Suas marcas que mais vendem</h2>
            <ol className="space-y-3">
              {ranking.map((r, i) => (
                <li key={r.creatorId}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">
                      {i + 1}. {r.brandName}
                    </span>
                    <span className="font-semibold">{formatBRL(r.sales)}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--background)]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(r.sales / maxSales) * 100}%`, background: r.brandColor }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    {r.orders} pedido(s) · comissão {formatBRL(r.commission)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Cards por marca */}
        <h2 className="mt-10 mb-4 text-xl font-bold">Suas marcas</h2>
        {perBrand.length === 0 ? (
          <div className="card text-sm text-[var(--muted)]">
            Você ainda não tem uma marca ativa. Ative seu painel na página da marca
            (ex.: /botanika/reivindicar).
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {perBrand.map((b) => (
              <Link
                key={b.creatorId}
                href={`/painel/${b.brandSlug}`}
                className="card transition hover:shadow-md"
                style={{ borderColor: b.brandColor }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: b.brandColor }}
                    >
                      {b.brandName.charAt(0)}
                    </span>
                    <span className="text-lg font-semibold">{b.brandName}</span>
                  </div>
                  <span className="font-mono text-sm font-semibold" style={{ color: b.brandColor }}>
                    {b.couponCode}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-[var(--muted)]">Vendas</p>
                    <p className="text-xl font-bold">{formatBRL(b.sales)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--muted)]">Comissão</p>
                    <p className="text-lg font-semibold" style={{ color: b.brandColor }}>
                      {formatBRL(b.commission)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold" style={{ color: b.brandColor }}>
                  Ver detalhes →
                </p>
              </Link>
            ))}
          </div>
        )}

        {pending.length > 0 && (
          <div className="card mt-6 border-[var(--warning)] bg-[#fff9ee] text-sm text-[var(--muted)]">
            Você tem {pending.length} cadastro(s) em análise:{" "}
            {pending.map((p) => p.brand.name).join(", ")}. Assim que aprovado(s),
            aparecem aqui.
          </div>
        )}
      </main>
    </div>
  );
}
