"use client";

import { useActionState } from "react";
import {
  saveBrandBriefingsAction,
  removeCampaignBannerAction,
  type ProgramState,
} from "@/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

export type BriefingView = {
  id: string;
  slug: string;
  color: string;
  generalBriefing: string | null;
  generalBriefingUrl: string | null;
  campaignActive: boolean;
  campaignTitle: string | null;
  campaignBody: string | null;
  campaignUrl: string | null;
  hasBanner: boolean;
};

export function BriefingSettings({ brand }: { brand: BriefingView }) {
  const [state, formAction] = useActionState<ProgramState, FormData>(
    saveBrandBriefingsAction,
    null,
  );

  return (
    <div className="space-y-6">
      {state?.ok && (
        <div className="rounded-lg border border-[var(--success)] bg-[var(--brand-soft)] px-4 py-2 text-sm text-[var(--brand-dark)]">
          Briefings salvos. A creator já vê no painel.
        </div>
      )}
      {state?.error && (
        <div className="rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-8">
        <input type="hidden" name="brandId" value={brand.id} />

        {/* Briefing geral */}
        <section className="card">
          <h2 className="text-lg font-semibold">Briefing geral</h2>
          <p className="mt-1 mb-4 text-sm text-[var(--muted)]">
            Orientações que valem sempre (tom de voz, o que pode/não pode, hashtags…).
            A creator vê isso fixo no painel.
          </p>
          <div className="space-y-4">
            <div>
              <label className="label">Texto do briefing geral</label>
              <textarea
                name="generalBriefing"
                className="input min-h-32"
                defaultValue={brand.generalBriefing || ""}
                placeholder="Ex.: sempre marque @marca, use a hashtag #..., evite promessas de cura…"
              />
            </div>
            <div>
              <label className="label">Link do material (Drive, Canva, PDF) — opcional</label>
              <input
                name="generalBriefingUrl"
                className="input"
                defaultValue={brand.generalBriefingUrl || ""}
                placeholder="https://…"
              />
            </div>
          </div>
        </section>

        {/* Campanha vigente */}
        <section className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Campanha vigente</h2>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="campaignActive" defaultChecked={brand.campaignActive} />
              Ativa (aparece pra creator)
            </label>
          </div>
          <p className="mt-1 mb-4 text-sm text-[var(--muted)]">
            Campanha do momento, com o banner e as orientações de conteúdo (stories/posts).
          </p>
          <div className="space-y-4">
            <div>
              <label className="label">Título da campanha</label>
              <input
                name="campaignTitle"
                className="input"
                defaultValue={brand.campaignTitle || ""}
                placeholder="Ex.: Semana da Imunidade"
              />
            </div>
            <div>
              <label className="label">Orientações de conteúdo (stories/posts)</label>
              <textarea
                name="campaignBody"
                className="input min-h-32"
                defaultValue={brand.campaignBody || ""}
                placeholder="O que postar, ângulos, ganchos, CTA, datas…"
              />
            </div>
            <div>
              <label className="label">Link do material da campanha — opcional</label>
              <input
                name="campaignUrl"
                className="input"
                defaultValue={brand.campaignUrl || ""}
                placeholder="https://…"
              />
            </div>

            {/* Banner */}
            <div>
              <label className="label">Banner da campanha (imagem)</label>
              {brand.hasBanner && (
                <div className="mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/brand-asset/${brand.slug}/campaign_banner`}
                    alt="Banner atual"
                    className="max-h-40 rounded-lg border"
                  />
                </div>
              )}
              <input
                name="banner"
                type="file"
                accept="image/*"
                className="input"
              />
              <p className="mt-1 text-xs text-[var(--muted)]">
                {brand.hasBanner
                  ? "Envie uma nova imagem para substituir o banner atual."
                  : "JPG, PNG ou WEBP (até 5MB)."}
              </p>
            </div>
          </div>
        </section>

        <SubmitButton className="btn btn-primary" pendingLabel="Salvando...">
          Salvar briefings
        </SubmitButton>
      </form>

      {brand.hasBanner && (
        <form action={removeCampaignBannerAction}>
          <input type="hidden" name="brandId" value={brand.id} />
          <button type="submit" className="text-sm font-semibold text-[var(--danger)]">
            Remover banner da campanha
          </button>
        </form>
      )}
    </div>
  );
}
