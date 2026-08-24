"use client";

import { useActionState, useState, useTransition } from "react";
import {
  loadCreatorFichaAction,
  saveCreatorFichaAction,
  type FichaLoad,
  type ApproveState,
} from "@/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import { formatBRL, formatDate } from "@/lib/format";

export function CreatorFicha({
  creatorId,
  color,
}: {
  creatorId: string;
  color: string;
}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<FichaLoad | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, startLoad] = useTransition();
  const [state, formAction] = useActionState<ApproveState, FormData>(
    saveCreatorFichaAction,
    null,
  );

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !data) {
      startLoad(async () => {
        try {
          setData(await loadCreatorFichaAction(creatorId));
        } catch (e) {
          setLoadError(e instanceof Error ? e.message : "Erro ao carregar a ficha.");
        }
      });
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <button type="button" onClick={toggle} className="btn btn-ghost">
        {open ? "Fechar ficha" : "📋 Ficha completa"}
      </button>

      {open && (
        <div className="mt-4">
          {loading && (
            <p className="text-sm text-[var(--muted)]">Carregando ficha…</p>
          )}
          {loadError && (
            <div className="rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
              {loadError}
            </div>
          )}
          {data && <FichaForm creatorId={creatorId} data={data} color={color} state={state} formAction={formAction} />}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}

function Check({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}

function FichaForm({
  creatorId,
  data,
  color,
  state,
  formAction,
}: {
  creatorId: string;
  data: FichaLoad;
  color: string;
  state: ApproveState;
  formAction: (formData: FormData) => void;
}) {
  const f = data.ficha;
  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="creatorId" value={creatorId} />

      {/* Estatísticas de venda (Shopify) */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card bg-[var(--brand-soft)]">
          <p className="text-xs text-[var(--muted)]">Venda total acumulada (paga)</p>
          <p className="mt-1 text-xl font-bold" style={{ color }}>
            {data.accumulatedSales != null ? formatBRL(data.accumulatedSales) : "—"}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-[var(--muted)]">Último pedido</p>
          <p className="mt-1 text-sm font-semibold">
            {data.lastOrderAt
              ? `${data.lastOrderName ?? ""} · ${formatDate(data.lastOrderAt)}`
              : data.shopifyOn
                ? "Nenhum ainda"
                : "Shopify não conectada"}
          </p>
        </div>
      </div>

      {/* Dados pessoais */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Dados pessoais</h4>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="WhatsApp / telefone" name="phone" defaultValue={f.phone} />
          <Field label="Instagram (@)" name="instagram" defaultValue={f.instagram} />
          <Field label="TikTok (@)" name="tiktok" defaultValue={f.tiktok} />
          <Field label="CPF" name="cpf" defaultValue={f.cpf} placeholder="000.000.000-00" />
          <Field label="Data de nascimento" name="birthDate" type="date" defaultValue={f.birthDate} />
          <Field label="Chave PIX" name="pixKey" defaultValue={f.pixKey} />
          <Field label="Nº de seguidores" name="followers" defaultValue={f.followers} placeholder="Ex.: 15000" />
        </div>
      </div>

      {/* Endereço */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Endereço para envio</h4>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="CEP" name="shipCep" defaultValue={f.shipCep} placeholder="00000-000" />
          <Field label="Rua / logradouro" name="shipStreet" defaultValue={f.shipStreet} className="sm:col-span-2" />
          <Field label="Número" name="shipNumber" defaultValue={f.shipNumber} />
          <Field label="Complemento" name="shipComplement" defaultValue={f.shipComplement} />
          <Field label="Bairro" name="shipDistrict" defaultValue={f.shipDistrict} />
          <Field label="Cidade" name="shipCity" defaultValue={f.shipCity} className="sm:col-span-2" />
          <Field label="UF" name="shipState" defaultValue={f.shipState} placeholder="SP" />
        </div>
      </div>

      {/* Contrato & status */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Contrato & status</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Início da parceria" name="contractStart" type="date" defaultValue={f.contractStart} />
          <Field label="Fim da vigência" name="contractEnd" type="date" defaultValue={f.contractEnd} />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Check label="Seguimos no Instagram?" name="followsInstagram" defaultChecked={f.followsInstagram} />
          <Check label="Está no grupo?" name="inGroup" defaultChecked={f.inGroup} />
          <Check label="Contrato assinado" name="contractSigned" defaultChecked={f.contractSigned} />
          <Check label="Etiquetada" name="tagged" defaultChecked={f.tagged} />
        </div>
      </div>

      {/* Observação */}
      <div>
        <label className="label">Observação (interno)</label>
        <textarea name="notes" defaultValue={f.notes ?? ""} rows={3} className="input" />
      </div>

      {state?.ok && (
        <div className="rounded-lg border border-[var(--success)] bg-[var(--brand-soft)] px-4 py-2 text-sm text-[var(--brand-dark)]">
          Ficha salva.
        </div>
      )}
      {state?.error && (
        <div className="rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
          {state.error}
        </div>
      )}

      <SubmitButton className="btn btn-primary" pendingLabel="Salvando...">
        Salvar ficha
      </SubmitButton>
    </form>
  );
}
