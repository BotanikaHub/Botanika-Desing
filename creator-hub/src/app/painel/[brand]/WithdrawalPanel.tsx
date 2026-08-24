"use client";

import { useActionState } from "react";
import {
  requestWithdrawalAction,
  type WithdrawalState,
} from "@/actions/withdrawals";
import { SubmitButton } from "@/components/SubmitButton";
import { formatBRL, formatDate } from "@/lib/format";
import type { WithdrawalSummary } from "@/lib/withdrawals";

export type WithdrawalRow = {
  id: string;
  amount: number;
  status: "REQUESTED" | "PAID" | "REJECTED";
  requestedAt: string;
  paidAt: string | null;
};

const STATUS: Record<WithdrawalRow["status"], { label: string; cls: string }> = {
  REQUESTED: { label: "Em análise", cls: "badge-pending" },
  PAID: { label: "Pago", cls: "badge-approved" },
  REJECTED: { label: "Recusado", cls: "badge-pending" },
};

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="card">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-xl font-bold" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );
}

export function WithdrawalPanel({
  creatorId,
  color,
  summary,
  withdrawals,
}: {
  creatorId: string;
  color: string;
  summary: WithdrawalSummary;
  withdrawals: WithdrawalRow[];
}) {
  const [state, formAction] = useActionState<WithdrawalState, FormData>(
    requestWithdrawalAction,
    null,
  );

  const missing = Math.max(0, summary.minSales - summary.accumulatedSales);

  return (
    <div className="card mt-6">
      <h2 className="mb-1 text-lg font-semibold">💸 Saque da comissão</h2>
      <p className="mb-4 text-xs text-[var(--muted)]">
        Comissão sobre o valor dos produtos em pedidos pagos. O saque libera a
        partir de {formatBRL(summary.minSales)} em vendas acumuladas e depois do
        envio da Nota Fiscal.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Comissão acumulada" value={formatBRL(summary.commission)} />
        <Stat label="Já pago" value={formatBRL(summary.paid)} />
        <Stat label="Disponível" value={formatBRL(summary.available)} color={color} />
      </div>

      {/* Estado do saque */}
      <div className="mt-4">
        {!summary.eligible ? (
          <div className="rounded-lg bg-[var(--background)] px-4 py-3 text-sm text-[var(--muted)]">
            Faltam <b>{formatBRL(missing)}</b> em vendas para liberar o saque
            (mínimo {formatBRL(summary.minSales)}). Vendas acumuladas hoje:{" "}
            <b>{formatBRL(summary.accumulatedSales)}</b>.
          </div>
        ) : summary.pending > 0 ? (
          <div className="rounded-lg border border-[var(--warning)] bg-[#fff9ee] px-4 py-3 text-sm">
            Você tem um saque de <b>{formatBRL(summary.pending)}</b> em análise.
            Assim que for pago, aparece aqui.
          </div>
        ) : summary.available > 0 ? (
          <form action={formAction} className="rounded-lg border bg-[var(--background)] p-4">
            <input type="hidden" name="creatorId" value={creatorId} />
            <p className="text-sm font-medium">
              Saldo disponível: <b style={{ color }}>{formatBRL(summary.available)}</b>
            </p>
            <div className="mt-3">
              <label className="label" htmlFor="nf">Nota Fiscal (PDF ou imagem) *</label>
              <input
                id="nf"
                name="nf"
                type="file"
                accept="application/pdf,image/*"
                required
                className="input"
              />
              <p className="mt-1 text-xs text-[var(--muted)]">
                Emita a NF do valor da comissão e anexe aqui para liberar o saque.
              </p>
            </div>
            {state?.error && (
              <div className="mt-3 rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
                {state.error}
              </div>
            )}
            {state?.ok && (
              <div className="mt-3 rounded-lg border border-[var(--success)] bg-[var(--brand-soft)] px-4 py-2 text-sm text-[var(--brand-dark)]">
                Saque solicitado! Assim que pago, você vê aqui.
              </div>
            )}
            <div className="mt-4">
              <SubmitButton className="btn btn-primary" pendingLabel="Enviando...">
                Solicitar saque
              </SubmitButton>
            </div>
          </form>
        ) : (
          <div className="rounded-lg bg-[var(--background)] px-4 py-3 text-sm text-[var(--muted)]">
            Sem saldo disponível para saque no momento.
          </div>
        )}
      </div>

      {/* Histórico */}
      {withdrawals.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold">Histórico de saques</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-[var(--muted)]">
                  <th className="py-2 pr-4 font-medium">Data</th>
                  <th className="py-2 pr-4 font-medium">Valor</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{formatDate(w.requestedAt)}</td>
                    <td className="py-2 pr-4 font-semibold">{formatBRL(w.amount)}</td>
                    <td className="py-2">
                      <span className={`badge ${STATUS[w.status].cls}`}>
                        {STATUS[w.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
