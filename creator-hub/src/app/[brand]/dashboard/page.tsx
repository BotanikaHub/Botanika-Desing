import { notFound, redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CopyButton } from "@/components/CopyButton";
import { getBrandBySlug, brandConnection } from "@/lib/brand";
import { getCurrentCreator } from "@/lib/auth";
import { creatorLogoutAction } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import {
  getOrdersByDiscountCode,
  isShopifyConfigured,
  type OrderStats,
} from "@/lib/shopify";
import { formatBRL, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const creator = await getCurrentCreator();
  if (!creator) redirect(`/${brand.slug}/login`);
  // creator logado mas de outra marca → manda para o login desta marca
  if (creator.brandId !== brand.id) redirect(`/${brand.slug}/login`);

  const clicks = await prisma.click.count({ where: { creatorId: creator.id } });
  const color = brand.primaryColor;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ ["--brand" as string]: color }}
    >
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Logo brandName={brand.name} color={color} />
          <form action={creatorLogoutAction}>
            <input type="hidden" name="brandSlug" value={brand.slug} />
            <button type="submit" className="btn btn-ghost">Sair</button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        <h1 className="text-2xl font-bold">
          Olá, {creator.name.split(" ")[0]} 👋
        </h1>

        {creator.status === "PENDING" && (
          <div className="card mt-6 border-[var(--warning)] bg-[#fff9ee]">
            <span className="badge badge-pending mb-2">Em análise</span>
            <h2 className="text-lg font-semibold">Seu cadastro está sendo avaliado</h2>
            <p className="mt-1 text-[var(--muted)]">
              Assim que for aprovado, seu cupom e link de afiliado aparecem aqui
              e você começa a acompanhar suas vendas.
            </p>
          </div>
        )}

        {creator.status === "REJECTED" && (
          <div className="card mt-6 border-[var(--danger)] bg-[#fdecea]">
            <span className="badge badge-rejected mb-2">Não aprovado</span>
            <h2 className="text-lg font-semibold">Cadastro não aprovado</h2>
            <p className="mt-1 text-[var(--muted)]">
              {creator.rejectionReason ||
                "Infelizmente seu cadastro não foi aprovado neste momento."}
            </p>
          </div>
        )}

        {creator.status === "APPROVED" && creator.couponCode && (
          <ApprovedDashboard
            couponCode={creator.couponCode}
            commissionRate={creator.commissionRate}
            clicks={clicks}
            conn={brandConnection(brand)}
          />
        )}
      </main>
    </div>
  );
}

async function ApprovedDashboard({
  couponCode,
  commissionRate,
  clicks,
  conn,
}: {
  couponCode: string;
  commissionRate: number;
  clicks: number;
  conn: ReturnType<typeof brandConnection>;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const affiliateLink = `${appUrl}/r/${couponCode}`;

  let stats: OrderStats | null = null;
  let shopifyError: string | null = null;
  const connected = isShopifyConfigured(conn);

  if (connected) {
    try {
      stats = await getOrdersByDiscountCode(conn, couponCode);
    } catch (err) {
      shopifyError = err instanceof Error ? err.message : "Erro ao consultar a loja.";
    }
  }

  const totalSales = stats?.totalSales ?? 0;
  const commission = totalSales * commissionRate;

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Vendas totais" value={formatBRL(totalSales)} />
        <Stat label="Pedidos" value={String(stats?.orderCount ?? 0)} />
        <Stat label={`Comissão (${Math.round(commissionRate * 100)}%)`} value={formatBRL(commission)} />
        <Stat label="Cliques no link" value={String(clicks)} />
      </div>

      {!connected && (
        <div className="card border-[var(--warning)] bg-[#fff9ee] text-sm text-[var(--muted)]">
          A integração com a Shopify desta marca ainda não foi conectada. Assim
          que a loja for conectada, suas vendas reais aparecem aqui
          automaticamente.
        </div>
      )}
      {shopifyError && (
        <div className="card border-[var(--danger)] bg-[#fdecea] text-sm text-[var(--danger)]">
          Não foi possível carregar as vendas: {shopifyError}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-sm font-semibold text-[var(--muted)]">Seu cupom de desconto</h3>
          <p className="mt-2 text-2xl font-bold tracking-widest text-[var(--brand)]">{couponCode}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {Math.round(commissionRate * 100)}% de desconto para o cliente.
          </p>
          <div className="mt-4">
            <CopyButton value={couponCode} label="Copiar cupom" />
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-[var(--muted)]">Seu link de afiliado</h3>
          <p className="mt-2 break-all rounded-lg bg-[var(--brand-soft)] px-3 py-2 text-sm">{affiliateLink}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">O cupom é aplicado automaticamente no checkout.</p>
          <div className="mt-4">
            <CopyButton value={affiliateLink} label="Copiar link" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 text-lg font-semibold">Pedidos com seu cupom</h3>
        {!stats || stats.orders.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Nenhum pedido ainda. Comece a divulgar seu cupom/link!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-[var(--muted)]">
                  <th className="py-2 pr-4 font-medium">Pedido</th>
                  <th className="py-2 pr-4 font-medium">Data</th>
                  <th className="py-2 pr-4 font-medium">Cliente</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Valor</th>
                  <th className="py-2 font-medium">Sua comissão</th>
                </tr>
              </thead>
              <tbody>
                {stats.orders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{o.name}</td>
                    <td className="py-2 pr-4">{formatDate(o.createdAt)}</td>
                    <td className="py-2 pr-4">{o.customer || "—"}</td>
                    <td className="py-2 pr-4">{o.financialStatus || "—"}</td>
                    <td className="py-2 pr-4">{formatBRL(o.total)}</td>
                    <td className="py-2 font-semibold text-[var(--brand)]">
                      {formatBRL(o.total * commissionRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
