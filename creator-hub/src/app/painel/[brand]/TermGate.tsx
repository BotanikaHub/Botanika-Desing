"use client";

import { useActionState } from "react";
import { acceptTermsAction, type TermState } from "@/actions/terms";
import { SubmitButton } from "@/components/SubmitButton";

export function TermGate({
  brandSlug,
  brandName,
  brandColor,
  termTitle,
  termBody,
  defaultName,
}: {
  brandSlug: string;
  brandName: string;
  brandColor: string;
  termTitle: string;
  termBody: string;
  defaultName: string;
}) {
  const [state, formAction] = useActionState<TermState, FormData>(
    acceptTermsAction,
    null,
  );

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="card">
        <span
          className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ background: brandColor }}
        >
          Falta 1 passo
        </span>
        <h1 className="text-2xl font-bold">{termTitle}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Pra ativar sua parceria com a {brandName} e entrar na lista de envio,
          leia e aceite o termo abaixo e confirme seu endereço.
        </p>

        <div className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border bg-[var(--background)] p-4 text-sm text-[var(--muted)]">
          {termBody}
        </div>

        {state?.error && (
          <div className="mt-4 rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
            {state.error}
          </div>
        )}

        <form action={formAction} className="mt-5 space-y-4">
          <input type="hidden" name="brandSlug" value={brandSlug} />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Nome completo</label>
              <input name="termsName" className="input" defaultValue={defaultName} required />
            </div>
            <div>
              <label className="label">CPF</label>
              <input name="termsCpf" className="input" placeholder="000.000.000-00" required />
            </div>
          </div>

          <p className="pt-2 text-sm font-semibold">Endereço de envio</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="label">CEP</label>
              <input name="shipCep" className="input" placeholder="00000-000" required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Rua</label>
              <input name="shipStreet" className="input" required />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="label">Número</label>
              <input name="shipNumber" className="input" required />
            </div>
            <div>
              <label className="label">Complemento</label>
              <input name="shipComplement" className="input" placeholder="opcional" />
            </div>
            <div>
              <label className="label">Bairro</label>
              <input name="shipDistrict" className="input" required />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="label">Cidade</label>
              <input name="shipCity" className="input" required />
            </div>
            <div>
              <label className="label">UF</label>
              <input name="shipState" className="input" maxLength={2} placeholder="SP" required />
            </div>
          </div>

          <label className="flex items-start gap-2 pt-1 text-sm">
            <input type="checkbox" name="accept" className="mt-1" required />
            <span>
              Li e aceito os termos acima. Confirmo que as informações são
              verdadeiras.
            </span>
          </label>

          <SubmitButton className="btn btn-primary" pendingLabel="Registrando aceite...">
            Aceitar e ativar
          </SubmitButton>
          <p className="text-xs text-[var(--muted)]">
            Registramos seu nome, CPF, data/hora e IP como comprovante do aceite.
          </p>
        </form>
      </div>
    </div>
  );
}
