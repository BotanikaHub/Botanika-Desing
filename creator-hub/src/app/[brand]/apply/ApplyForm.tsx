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

      <div>
        <label className="label" htmlFor="niche">Nicho</label>
        <input id="niche" name="niche" className="input" placeholder="Ex.: saúde, beleza, casa" />
      </div>

      <div>
        <label className="label" htmlFor="desiredCoupon">Cupom desejado (opcional)</label>
        <input id="desiredCoupon" name="desiredCoupon" className="input" placeholder="Ex.: MARIA10 — sujeito à disponibilidade" />
      </div>

      {/* Dados para contrato e pagamento (coletados já no cadastro) */}
      <div className="border-t pt-5">
        <h2 className="mb-1 text-sm font-semibold">Dados para contrato e pagamento</h2>
        <p className="mb-4 text-xs text-[var(--muted)]">
          Usados no contrato e no pagamento da sua comissão. Ficam guardados com segurança.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="cpf">CPF</label>
            <input id="cpf" name="cpf" className="input" placeholder="000.000.000-00" />
          </div>
          <div>
            <label className="label" htmlFor="birthDate">Data de nascimento</label>
            <input id="birthDate" name="birthDate" type="date" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="pixKey">Chave PIX</label>
            <input id="pixKey" name="pixKey" className="input" placeholder="CPF, e-mail, telefone ou aleatória" />
          </div>
        </div>
      </div>

      {/* Endereço completo (envio de kits) */}
      <div className="border-t pt-5">
        <h2 className="mb-4 text-sm font-semibold">Endereço para envio de kits</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="shipCep">CEP</label>
            <input id="shipCep" name="shipCep" className="input" placeholder="00000-000" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="shipStreet">Rua / logradouro</label>
            <input id="shipStreet" name="shipStreet" className="input" />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="shipNumber">Número</label>
            <input id="shipNumber" name="shipNumber" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="shipComplement">Complemento</label>
            <input id="shipComplement" name="shipComplement" className="input" placeholder="Apto, bloco (opcional)" />
          </div>
          <div>
            <label className="label" htmlFor="shipDistrict">Bairro</label>
            <input id="shipDistrict" name="shipDistrict" className="input" />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="shipCity">Cidade</label>
            <input id="shipCity" name="shipCity" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="shipState">UF</label>
            <input id="shipState" name="shipState" className="input" maxLength={2} placeholder="SP" />
          </div>
        </div>
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
