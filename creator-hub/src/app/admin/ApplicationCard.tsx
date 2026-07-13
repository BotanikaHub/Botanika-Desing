"use client";

import { useActionState } from "react";
import {
  approveCreatorAction,
  rejectCreatorAction,
  type ApproveState,
} from "@/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

export type CreatorView = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  instagram: string | null;
  tiktok: string | null;
  followers: number | null;
  niche: string | null;
  city: string | null;
  pitch: string | null;
  desiredCoupon: string | null;
  createdAt: string;
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
          <h3 className="text-lg font-semibold">{creator.name}</h3>
          <p className="text-sm text-[var(--muted)]">{creator.email}</p>
        </div>
        <span className="badge badge-pending">Pendente</span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        <Info label="Instagram" value={creator.instagram} />
        <Info label="TikTok" value={creator.tiktok} />
        <Info
          label="Seguidores"
          value={creator.followers ? creator.followers.toLocaleString("pt-BR") : null}
        />
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

      {/* Aprovar */}
      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3 border-t pt-4">
        <input type="hidden" name="creatorId" value={creator.id} />
        <div className="w-40">
          <label className="label">Cupom</label>
          <input
            name="couponCode"
            className="input"
            defaultValue={creator.desiredCoupon || ""}
            placeholder="EX: MARIA10"
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
            defaultValue={10}
          />
        </div>
        <SubmitButton className="btn btn-primary" pendingLabel="Aprovando...">
          Aprovar
        </SubmitButton>
      </form>

      {/* Recusar */}
      <form action={rejectCreatorAction} className="mt-3 flex flex-wrap items-end gap-3">
        <input type="hidden" name="creatorId" value={creator.id} />
        <div className="flex-1">
          <input
            name="reason"
            className="input"
            placeholder="Motivo da recusa (opcional)"
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Recusar
        </button>
      </form>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
        {label}
      </dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  );
}
