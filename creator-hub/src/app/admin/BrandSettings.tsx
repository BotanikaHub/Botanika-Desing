"use client";

import { useActionState, useState } from "react";
import {
  saveBrandShopifyConfigAction,
  importShopifyCouponsAction,
  type BrandConfigState,
  type ImportState,
} from "@/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

export type BrandView = {
  id: string;
  name: string;
  slug: string;
  color: string;
  shopDomain: string | null;
  storeUrl: string | null;
  shopifyApiKey: string | null;
  hasSecret: boolean;
  connected: boolean;
};

export function BrandSettings({ brands }: { brands: BrandView[] }) {
  return (
    <div className="space-y-4">
      {brands.map((b) => (
        <BrandCard key={b.id} brand={b} />
      ))}
    </div>
  );
}

function BrandCard({ brand }: { brand: BrandView }) {
  const [state, formAction] = useActionState<BrandConfigState, FormData>(
    saveBrandShopifyConfigAction,
    null,
  );
  const [importState, importAction] = useActionState<ImportState, FormData>(
    importShopifyCouponsAction,
    null,
  );
  const [open, setOpen] = useState(false);

  const canConnect = Boolean(brand.shopDomain && brand.shopifyApiKey && brand.hasSecret);

  return (
    <div className="card">
      {/* Cabeçalho: marca + status (sempre visível) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: brand.color }}
          >
            {brand.name.charAt(0)}
          </span>
          <h3 className="text-lg font-semibold">{brand.name}</h3>
        </div>
        {brand.connected ? (
          <span className="badge badge-approved">Shopify conectada ✓</span>
        ) : (
          <span className="badge badge-pending">Não conectada</span>
        )}
      </div>

      {/* Resumo compacto (domínio + site público) */}
      {!open && (
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Domínio .myshopify.com
            </dt>
            <dd className="font-medium">{brand.shopDomain || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Site público da loja
            </dt>
            <dd className="font-medium">{brand.storeUrl || "—"}</dd>
          </div>
        </dl>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-4 text-sm font-semibold text-[var(--brand)]"
      >
        {open ? "▲ Ocultar configurações" : "▾ Configurações de conexão"}
      </button>

      {open && (
        <>
          {state?.ok && (
            <div className="mt-3 rounded-lg border border-[var(--success)] bg-[var(--brand-soft)] px-4 py-2 text-sm text-[var(--brand-dark)]">
              Configuração salva.
            </div>
          )}
          {state?.error && (
            <div className="mt-3 rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
              {state.error}
            </div>
          )}

          <form action={formAction} className="mt-4 space-y-3 border-t pt-4">
            <input type="hidden" name="brandId" value={brand.id} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Domínio .myshopify.com</label>
                <input
                  name="shopDomain"
                  className="input"
                  defaultValue={brand.shopDomain || ""}
                  placeholder="sua-loja.myshopify.com"
                />
              </div>
              <div>
                <label className="label">Site público da loja</label>
                <input
                  name="storeUrl"
                  className="input"
                  defaultValue={brand.storeUrl || ""}
                  placeholder="https://sualoja.com.br"
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Shopify Client ID</label>
                <input
                  name="shopifyApiKey"
                  className="input"
                  defaultValue={brand.shopifyApiKey || ""}
                  placeholder="Client ID do app (Dev Dashboard)"
                />
              </div>
              <div>
                <label className="label">
                  Shopify Client Secret {brand.hasSecret && "(salvo — deixe em branco p/ manter)"}
                </label>
                <input
                  name="shopifyApiSecret"
                  type="password"
                  className="input"
                  placeholder={brand.hasSecret ? "•••••••• (mantém o atual)" : "shpss_..."}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <SubmitButton className="btn btn-ghost" pendingLabel="Salvando...">
                Salvar credenciais
              </SubmitButton>
              {canConnect ? (
                <a href={`/api/shopify/install?brand=${brand.slug}`} className="btn btn-primary">
                  {brand.connected ? "Reconectar Shopify" : "Conectar Shopify"}
                </a>
              ) : (
                <span className="text-xs text-[var(--muted)]">
                  Preencha domínio + Client ID + Secret e salve para liberar a conexão.
                </span>
              )}
            </div>
          </form>

          {brand.connected && (
            <form action={importAction} className="mt-4 border-t pt-4">
              <input type="hidden" name="brandId" value={brand.id} />
              <div className="flex flex-wrap items-center gap-3">
                <SubmitButton className="btn btn-outline" pendingLabel="Importando...">
                  Importar cupons da Shopify
                </SubmitButton>
                <span className="text-xs text-[var(--muted)]">
                  Traz todos os cupons ativos da loja como afiliados. Cada influencer
                  ativa o painel dela depois em <b>/{brand.slug}/reivindicar</b>.
                </span>
              </div>
              {typeof importState?.imported === "number" && (
                <div className="mt-3 rounded-lg border border-[var(--success)] bg-[var(--brand-soft)] px-4 py-2 text-sm text-[var(--brand-dark)]">
                  {importState.imported} cupom(ns) importado(s).{" "}
                  {importState.skipped ? `${importState.skipped} já existiam.` : ""}
                </div>
              )}
              {importState?.error && (
                <div className="mt-3 rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
                  {importState.error}
                </div>
              )}
            </form>
          )}
        </>
      )}
    </div>
  );
}
