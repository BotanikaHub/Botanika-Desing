"use client";

import { useActionState, useState } from "react";
import {
  approveCreatorAction,
  editCreatorCouponAction,
  rejectCreatorAction,
  type ApproveState,
} from "@/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import { CouponEditor } from "./CouponEditor";

export type CreatorView = {
  id: string;
  brandName: string;
  brandColor: string;
  name: string;
  email: string;
  phone: string | null;
  instagram: string | null;
  tiktok: string | null;
  followers: number | null;
  niche: string | null;
  profession: string | null;
  city: string | null;
  pitch: string | null;
  desiredCoupon: string | null;
  defaultRatePct: number;
  defaultDiscountPct: number;
};

export function PendingCard({ creator }: { creator: CreatorView }) {
  const [state, formAction] = useActionState<ApproveState, FormData>(
    approveCreatorAction,
    null,
  );

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span
            className="mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold text-white"
            style={{ background: creator.brandColor }}
          >
            {creator.brandName}
          </span>
          <h3 className="text-lg font-semibold">{creator.name}</h3>
          <p className="text-sm text-[var(--muted)]">{creator.email}</p>
        </div>
        <span className="badge badge-pending">Pendente</span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        <Info label="Profissão" value={creator.profession} />
        <Info label="Instagram" value={creator.instagram} />
        <Info label="TikTok" value={creator.tiktok} />
        <Info label="Seguidores" value={creator.followers ? creator.followers.toLocaleString("pt-BR") : null} />
        <Info label="Nicho" value={creator.niche} />
        <Info label="Cidade" value={creator.city} />
        <Info label="Telefone" value={creator.phone} />
      </dl>

      {creator.pitch && (
        <p className="mt-3 rounded-lg bg-[var(--background)] p-3 text-sm text-[var(--muted)]">
          “{creator.pitch}”
        </p>
      )}

      {state?.error && (
        <div className="mt-4 rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-4 border-t pt-4">
        <input type="hidden" name="creatorId" value={creator.id} />
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-40">
            <label className="label">Cupom</label>
            <input name="couponCode" className="input" defaultValue={creator.desiredCoupon || ""} placeholder="EX: MARIA" />
          </div>
          <div className="w-28">
            <label className="label">Comissão %</label>
            <input name="commissionRate" type="number" min={0} max={100} step={1} className="input" defaultValue={creator.defaultRatePct} />
          </div>
          <div className="w-28">
            <label className="label">Desconto %</label>
            <input name="discountRate" type="number" min={0} max={100} step={1} className="input" defaultValue={creator.defaultDiscountPct} />
          </div>
          <SubmitButton className="btn btn-primary" pendingLabel="Aprovando...">Aprovar</SubmitButton>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          <b>Comissão</b> = o que a creator ganha (interno). <b>Desconto</b> = o que o
          cliente ganha no cupom (vai pra Shopify).
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" name="linkExisting" />
          Cupom já existe na Shopify — só <b>vincular</b> (não criar). Use o código
          exato do cupom atual da creator.
        </label>
      </form>

      <form action={rejectCreatorAction} className="mt-3 flex flex-wrap items-end gap-3">
        <input type="hidden" name="creatorId" value={creator.id} />
        <div className="flex-1">
          <input name="reason" className="input" placeholder="Motivo da recusa (opcional)" />
        </div>
        <button type="submit" className="btn btn-danger">Recusar</button>
      </form>
    </div>
  );
}

export type ApprovedView = {
  id: string;
  brandId: string;
  brandName: string;
  brandColor: string;
  name: string;
  email: string;
  couponCode: string | null;
  commissionRatePct: number;
  discountPct: number | null;
  couponSummary: string | null;
  approvedAt: string | null;
  claimed: boolean;
};

export function ApprovedCard({ creator }: { creator: ApprovedView }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ApproveState, FormData>(
    editCreatorCouponAction,
    null,
  );

  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: creator.brandColor }}
          >
            {creator.brandName.charAt(0)}
          </span>
          <div>
            <p className="font-semibold">{creator.name}</p>
            <p className="text-sm text-[var(--muted)]">
              {creator.claimed ? (
                creator.email
              ) : (
                <span className="badge badge-pending">Aguardando ativação</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-mono font-bold text-[var(--brand)]">
              {creator.couponCode}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {creator.commissionRatePct}% comissão
              {creator.couponSummary
                ? ` · ${creator.couponSummary}`
                : creator.discountPct != null
                  ? ` · ${creator.discountPct}% desconto`
                  : ""}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Fechar" : "Editar cupom"}
          </button>
        </div>
      </div>

      {open && (
        <>
          {state?.ok && (
            <div className="mt-3 rounded-lg border border-[var(--success)] bg-[var(--brand-soft)] px-4 py-2 text-sm text-[var(--brand-dark)]">
              Cupom atualizado.
            </div>
          )}
          {state?.error && (
            <div className="mt-3 rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
              {state.error}
            </div>
          )}
          <form action={formAction} className="mt-4 border-t pt-4">
            <input type="hidden" name="creatorId" value={creator.id} />
            <div className="flex flex-wrap items-end gap-3">
              <div className="w-44">
                <label className="label">Cupom</label>
                <input
                  name="couponCode"
                  className="input"
                  defaultValue={creator.couponCode || ""}
                />
              </div>
              <div className="w-28">
                <label className="label">Comissão %</label>
                <input
                  name="commissionRate"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  className="input"
                  defaultValue={creator.commissionRatePct}
                />
              </div>
              <SubmitButton className="btn btn-primary" pendingLabel="Salvando...">
                Salvar
              </SubmitButton>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              <b>Comissão</b> = ganho da creator (interno). O valor e onde o cupom se
              aplica ficam no editor abaixo.
            </p>
            <label className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
              <input type="checkbox" name="linkExisting" defaultChecked />
              Vincular cupom já existente na Shopify (não criar). Use o código
              exato — o painel passa a puxar as vendas desse cupom.
            </label>
          </form>

          <CouponEditor
            creatorId={creator.id}
            brandId={creator.brandId}
            brandColor={creator.brandColor}
          />
        </>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  );
}
