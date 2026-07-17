"use client";

import { useActionState } from "react";
import { applyAction, type ApplyState } from "@/actions/apply";
import { SubmitButton } from "@/components/SubmitButton";

export function ApplyForm({ brandSlug }: { brandSlug: string }) {
  const [state, formAction] = useActionState<ApplyState, FormData>(
    applyAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="brandSlug" value={brandSlug} />

      {state?.error && (
        <div className="rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-3 text-sm text-[var(--danger)]">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Nome completo *</label>
          <input id="name" name="name" className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="email">E-mail *</label>
          <input id="email" name="email" type="email" className="input" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="password">Crie uma senha *</label>
          <input id="password" name="password" type="password" className="input" minLength={6} required />
        </div>
        <div>
          <label className="label" htmlFor="phone">WhatsApp / telefone</label>
          <input id="phone" name="phone" className="input" placeholder="(00) 00000-0000" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="instagram">Instagram (@)</label>
          <input id="instagram" name="instagram" className="input" placeholder="@seu_perfil" />
        </div>
        <div>
          <label className="label" htmlFor="tiktok">TikTok (@)</label>
          <input id="tiktok" name="tiktok" className="input" placeholder="@seu_perfil" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="profession">Profissão</label>
          <input id="profession" name="profession" className="input" placeholder="Ex.: médico, nutricionista, influenciador" />
        </div>
        <div>
          <label className="label" htmlFor="followers">Nº de seguidores</label>
          <input id="followers" name="followers" className="input" placeholder="Ex.: 15000" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="niche">Nicho</label>
          <input id="niche" name="niche" className="input" placeholder="Ex.: saúde, beleza, casa" />
        </div>
        <div>
          <label className="label" htmlFor="city">Cidade / UF</label>
          <input id="city" name="city" className="input" placeholder="Ex.: São Paulo/SP" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="desiredCoupon">Cupom desejado (opcional)</label>
        <input id="desiredCoupon" name="desiredCoupon" className="input" placeholder="Ex.: MARIA10 — sujeito à disponibilidade" />
      </div>

      <div>
        <label className="label" htmlFor="pitch">Conte um pouco sobre você e por que quer divulgar</label>
        <textarea id="pitch" name="pitch" className="input" rows={4} />
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-[var(--muted)]">
          Ao enviar, seu cadastro fica em análise. Você recebe o acesso após a aprovação.
        </p>
        <SubmitButton pendingLabel="Enviando...">Enviar cadastro</SubmitButton>
      </div>
    </form>
  );
}
