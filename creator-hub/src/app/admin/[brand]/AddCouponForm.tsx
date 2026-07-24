"use client";

import { useActionState, useRef } from "react";
import { addCouponAction, type ApproveState } from "@/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

export function AddCouponForm({
  brandId,
  brandColor,
  defaultRatePct,
  defaultDiscountPct,
}: {
  brandId: string;
  brandColor: string;
  defaultRatePct: number;
  defaultDiscountPct: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<ApproveState, FormData>(
    async (prev, fd) => {
      const res = await addCouponAction(prev, fd);
      if (res?.ok) formRef.current?.reset();
      return res;
    },
    null,
  );

  return (
    <div className="card" style={{ borderColor: brandColor }}>
      <h2 className="text-lg font-semibold">Adicionar cupom</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Cria um cupom manualmente (ou vincula um já existente na Shopify). A
        influencer pode ativar o painel dela depois com esse código.
      </p>

      {state?.ok && (
        <div className="mt-3 rounded-lg border border-[var(--success)] bg-[var(--brand-soft)] px-4 py-2 text-sm text-[var(--brand-dark)]">
          Cupom adicionado. ✓
        </div>
      )}
      {state?.error && (
        <div className="mt-3 rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
          {state.error}
        </div>
      )}

      <form ref={formRef} action={formAction} className="mt-4">
        <input type="hidden" name="brandId" value={brandId} />
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-40 flex-1">
            <label className="label">Nome</label>
            <input name="name" className="input" placeholder="Nome da creator" />
          </div>
          <div className="w-40">
            <label className="label">Cupom</label>
            <input name="couponCode" className="input" placeholder="EX: MARIA" required />
          </div>
          <div className="w-24">
            <label className="label">Comissão %</label>
            <input name="commissionRate" type="number" min={0} max={100} step={1} className="input" defaultValue={defaultRatePct} />
          </div>
          <div className="w-24">
            <label className="label">Desconto %</label>
            <input name="discountRate" type="number" min={0} max={100} step={1} className="input" defaultValue={defaultDiscountPct} />
          </div>
          <SubmitButton className="btn btn-primary" pendingLabel="Adicionando...">
            Adicionar
          </SubmitButton>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" name="linkExisting" />
          Cupom já existe na Shopify — só <b>vincular</b> (não criar).
        </label>
      </form>
    </div>
  );
}
