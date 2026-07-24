"use client";

import { useActionState, useState } from "react";
import { saveBrandProgramAction, type ProgramState } from "@/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

export type ProgramView = {
  id: string;
  color: string;
  termTitle: string | null;
  termBody: string | null;
  goalPeriod: string;
  goalDefaultAmount: number;
  bonusStepAmount: number;
  bonusLabel: string;
};

export function ProgramSettings({ brand }: { brand: ProgramView }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ProgramState, FormData>(
    saveBrandProgramAction,
    null,
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Metas & Termo</h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-sm font-semibold"
          style={{ color: brand.color }}
        >
          {open ? "▲ Ocultar" : "▾ Configurar"}
        </button>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Texto do termo de aceite e as metas/bônus da gamificação (o creator vê a
        meta no painel dele).
      </p>

      {open && (
        <>
          {state?.ok && (
            <div className="mt-3 rounded-lg border border-[var(--success)] bg-[var(--brand-soft)] px-4 py-2 text-sm text-[var(--brand-dark)]">
              Salvo.
            </div>
          )}
          {state?.error && (
            <div className="mt-3 rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
              {state.error}
            </div>
          )}

          <form action={formAction} className="mt-4 space-y-5 border-t pt-4">
            <input type="hidden" name="brandId" value={brand.id} />

            {/* Termo */}
            <div>
              <label className="label">Título do termo</label>
              <input
                name="termTitle"
                className="input"
                defaultValue={brand.termTitle || ""}
                placeholder="Termo de aceite do Creator Club"
              />
            </div>
            <div>
              <label className="label">Texto do termo</label>
              <textarea
                name="termBody"
                className="input min-h-40"
                defaultValue={brand.termBody || ""}
                placeholder="Cole aqui o texto do termo que a creator vai ler e aceitar…"
              />
              <p className="mt-1 text-xs text-[var(--muted)]">
                Ao mudar o texto, a versão do termo sobe automaticamente (mantém o
                rastro de quem aceitou qual versão).
              </p>
            </div>

            {/* Gamificação */}
            <div className="border-t pt-4">
              <p className="mb-3 text-sm font-semibold">Meta & bônus</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Período da meta</label>
                  <select name="goalPeriod" className="input" defaultValue={brand.goalPeriod}>
                    <option value="monthly">Mensal (reinicia todo mês)</option>
                    <option value="all">Acumulada (total)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Meta padrão (R$)</label>
                  <input
                    name="goalDefaultAmount"
                    type="number"
                    min={0}
                    step={100}
                    className="input"
                    defaultValue={brand.goalDefaultAmount}
                  />
                </div>
                <div>
                  <label className="label">Bônus a cada (R$ além da meta)</label>
                  <input
                    name="bonusStepAmount"
                    type="number"
                    min={0}
                    step={100}
                    className="input"
                    defaultValue={brand.bonusStepAmount}
                  />
                </div>
                <div>
                  <label className="label">Nome do bônus</label>
                  <input
                    name="bonusLabel"
                    className="input"
                    defaultValue={brand.bonusLabel}
                    placeholder="ex.: suplemento extra"
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Cada creator pode ter uma meta individual (editada no card dele); sem
                isso, vale a meta padrão da marca.
              </p>
            </div>

            <SubmitButton className="btn btn-primary" pendingLabel="Salvando...">
              Salvar programa
            </SubmitButton>
          </form>
        </>
      )}
    </div>
  );
}
