"use client";

import { useActionState } from "react";
import { claimCreatorAction, type LoginState } from "@/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

export function ClaimForm({ brandSlug }: { brandSlug: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    claimCreatorAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="brandSlug" value={brandSlug} />
      {state?.error && (
        <div className="rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-3 text-sm text-[var(--danger)]">
          {state.error}
        </div>
      )}
      <div>
        <label className="label" htmlFor="couponCode">
          Seu cupom
        </label>
        <input
          id="couponCode"
          name="couponCode"
          className="input"
          placeholder="Ex.: MARIA10"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="email">
          Seu e-mail
        </label>
        <input id="email" name="email" type="email" className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Crie uma senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          minLength={6}
          required
        />
      </div>
      <SubmitButton className="btn btn-primary w-full" pendingLabel="Ativando...">
        Ativar meu painel
      </SubmitButton>
    </form>
  );
}
