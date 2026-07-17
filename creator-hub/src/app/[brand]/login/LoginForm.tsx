"use client";

import { useActionState } from "react";
import { creatorLoginAction, type LoginState } from "@/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

export function LoginForm({ brandSlug }: { brandSlug: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    creatorLoginAction,
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
        <label className="label" htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="password">Senha</label>
        <input id="password" name="password" type="password" className="input" required />
      </div>
      <SubmitButton className="btn btn-primary w-full" pendingLabel="Entrando...">
        Entrar
      </SubmitButton>
    </form>
  );
}
