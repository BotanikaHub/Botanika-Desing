import { prisma } from "@/lib/prisma";
import { requireBrandAdmin } from "@/lib/admin-brand";
import { markWithdrawalPaidAction, rejectWithdrawalAction } from "@/actions/admin";
import { formatBRL, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; cls: string }> = {
  REQUESTED: { label: "Em análise", cls: "badge-pending" },
  PAID: { label: "Pago", cls: "badge-approved" },
  REJECTED: { label: "Recusado", cls: "badge-pending" },
};

export default async function SaquesTab({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const { brand } = await requireBrandAdmin(slug);

  const rows = await prisma.withdrawal.findMany({
    where: { creator: { brandId: brand.id } },
    select: {
      id: true,
      amount: true,
      status: true,
      requestedAt: true,
      paidAt: true,
      nfName: true,
      adminNote: true,
      creator: { select: { name: true, couponCode: true } },
    },
    orderBy: [{ status: "asc" }, { requestedAt: "desc" }],
  });

  const pending = rows.filter((r) => r.status === "REQUESTED");
  const history = rows.filter((r) => r.status !== "REQUESTED");

  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">
        Saques <span className="text-[var(--muted)]">({pending.length} em análise)</span>
      </h1>
      <p className="mb-6 text-sm text-[var(--muted)]">
        Solicitações de saque das creators. Pague por PIX (usando a chave da ficha)
        e marque como <b>pago</b>. A Nota Fiscal anexada fica disponível para conferência.
      </p>

      {pending.length === 0 ? (
        <div className="card text-sm text-[var(--muted)]">Nenhum saque em análise.</div>
      ) : (
        <div className="space-y-3">
          {pending.map((w) => (
            <div key={w.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{w.creator.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    <span className="font-mono">{w.creator.couponCode}</span> · solicitado em{" "}
                    {formatDate(w.requestedAt)}
                  </p>
                </div>
                <p className="text-xl font-bold text-[var(--brand)]">{formatBRL(w.amount)}</p>
              </div>

              <div className="mt-3">
                {w.nfName ? (
                  <a
                    href={`/admin/${brand.slug}/saques/nf/${w.id}`}
                    target="_blank"
                    className="btn btn-outline"
                  >
                    📄 Ver Nota Fiscal
                  </a>
                ) : (
                  <span className="text-sm text-[var(--danger)]">Sem NF anexada</span>
                )}
              </div>

              <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2">
                <form action={markWithdrawalPaidAction} className="space-y-2">
                  <input type="hidden" name="withdrawalId" value={w.id} />
                  <input
                    name="adminNote"
                    className="input"
                    placeholder="Comprovante / obs. (opcional)"
                  />
                  <button type="submit" className="btn btn-primary w-full">
                    Marcar como pago
                  </button>
                </form>
                <form action={rejectWithdrawalAction} className="space-y-2">
                  <input type="hidden" name="withdrawalId" value={w.id} />
                  <input name="adminNote" className="input" placeholder="Motivo da recusa (opcional)" />
                  <button type="submit" className="btn btn-outline w-full text-[var(--danger)]">
                    Recusar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-bold">Histórico</h2>
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-[var(--muted)]">
                  <th className="py-2 pr-4 font-medium">Creator</th>
                  <th className="py-2 pr-4 font-medium">Cupom</th>
                  <th className="py-2 pr-4 text-right font-medium">Valor</th>
                  <th className="py-2 pr-4 font-medium">Data</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">NF</th>
                </tr>
              </thead>
              <tbody>
                {history.map((w) => (
                  <tr key={w.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{w.creator.name}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{w.creator.couponCode}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{formatBRL(w.amount)}</td>
                    <td className="py-2 pr-4">{formatDate(w.paidAt ?? w.requestedAt)}</td>
                    <td className="py-2 pr-4">
                      <span className={`badge ${STATUS[w.status].cls}`}>
                        {STATUS[w.status].label}
                      </span>
                    </td>
                    <td className="py-2">
                      {w.nfName ? (
                        <a
                          href={`/admin/${brand.slug}/saques/nf/${w.id}`}
                          target="_blank"
                          className="text-[var(--brand)] underline"
                        >
                          ver
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
