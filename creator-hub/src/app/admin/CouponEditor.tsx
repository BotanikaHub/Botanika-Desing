"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  loadCouponConfigAction,
  saveCouponConfigAction,
  searchShopifyItemsAction,
  type ApproveState,
} from "@/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

type PickItem = { id: string; title: string };

// Estado do formulário — valor em unidades "de tela" (% inteiro ou R$).
type FormState = {
  kind: "amount" | "free_shipping";
  valueType: "percentage" | "fixed";
  value: string;
  appliesTo: "order" | "products" | "collections";
  products: PickItem[];
  collections: PickItem[];
  minSubtotal: string;
  usageLimit: string;
  oncePerCustomer: boolean;
};

const EMPTY: FormState = {
  kind: "amount",
  valueType: "percentage",
  value: "5",
  appliesTo: "order",
  products: [],
  collections: [],
  minSubtotal: "",
  usageLimit: "",
  oncePerCustomer: false,
};

export function CouponEditor({
  creatorId,
  brandId,
  brandColor,
}: {
  creatorId: string;
  brandId: string;
  brandColor: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [state, formAction] = useActionState<ApproveState, FormData>(
    saveCouponConfigAction,
    null,
  );

  // Carrega a config atual da Shopify ao abrir (uma vez).
  useEffect(() => {
    if (!open || loaded) return;
    let alive = true;
    setLoading(true);
    setLoadError(null);
    loadCouponConfigAction(creatorId)
      .then((res) => {
        if (!alive) return;
        const c = res.config;
        setForm({
          kind: c.kind,
          valueType: c.valueType,
          value:
            c.valueType === "percentage"
              ? String(Math.round(c.value * 100))
              : String(c.value),
          appliesTo: c.appliesTo,
          products: res.productLabels,
          collections: res.collectionLabels,
          minSubtotal: c.minSubtotal != null ? String(c.minSubtotal) : "",
          usageLimit: c.usageLimit != null ? String(c.usageLimit) : "",
          oncePerCustomer: c.oncePerCustomer,
        });
        setLoadError(res.error ?? (res.shopifyOn ? null : "Conecte a Shopify desta marca."));
        setLoaded(true);
      })
      .catch((e) => {
        if (alive) setLoadError(e instanceof Error ? e.message : "Erro ao carregar.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [open, loaded, creatorId]);

  // Payload que o servidor espera (value em % inteiro p/ percentage; R$ p/ fixed).
  const payload = {
    kind: form.kind,
    valueType: form.valueType,
    value: parseFloat(form.value) || 0,
    appliesTo: form.appliesTo,
    productIds: form.products.map((p) => p.id),
    collectionIds: form.collections.map((c) => c.id),
    minSubtotal: form.minSubtotal ? parseFloat(form.minSubtotal) : null,
    usageLimit: form.usageLimit ? parseInt(form.usageLimit, 10) : null,
    oncePerCustomer: form.oncePerCustomer,
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mt-4 border-t pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-semibold"
        style={{ color: brandColor }}
      >
        {open ? "▲ Ocultar configuração do cupom" : "⚙ Configurar cupom na Shopify"}
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {loading && (
            <p className="text-sm text-[var(--muted)]">Carregando configuração atual…</p>
          )}
          {loadError && (
            <div className="rounded-lg border border-[var(--warning)] bg-[#fff9ee] px-4 py-2 text-sm text-[var(--muted)]">
              {loadError}
            </div>
          )}

          {!loading && (
            <>
              {/* Tipo do cupom */}
              <div>
                <label className="label">Tipo do cupom</label>
                <div className="flex gap-2">
                  <Toggle
                    active={form.kind === "amount"}
                    color={brandColor}
                    onClick={() => set("kind", "amount")}
                  >
                    Desconto no valor
                  </Toggle>
                  <Toggle
                    active={form.kind === "free_shipping"}
                    color={brandColor}
                    onClick={() => set("kind", "free_shipping")}
                  >
                    Frete grátis
                  </Toggle>
                </div>
              </div>

              {form.kind === "amount" && (
                <>
                  {/* Valor */}
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="w-40">
                      <label className="label">Valor</label>
                      <select
                        className="input"
                        value={form.valueType}
                        onChange={(e) =>
                          set("valueType", e.target.value as FormState["valueType"])
                        }
                      >
                        <option value="percentage">Percentual (%)</option>
                        <option value="fixed">Valor fixo (R$)</option>
                      </select>
                    </div>
                    <div className="w-28">
                      <label className="label">
                        {form.valueType === "percentage" ? "%" : "R$"}
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={form.valueType === "percentage" ? 1 : 0.01}
                        className="input"
                        value={form.value}
                        onChange={(e) => set("value", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Onde aplica */}
                  <div>
                    <label className="label">Aplica em</label>
                    <div className="flex flex-wrap gap-2">
                      <Toggle active={form.appliesTo === "order"} color={brandColor} onClick={() => set("appliesTo", "order")}>
                        Pedido inteiro
                      </Toggle>
                      <Toggle active={form.appliesTo === "products"} color={brandColor} onClick={() => set("appliesTo", "products")}>
                        Produtos específicos
                      </Toggle>
                      <Toggle active={form.appliesTo === "collections"} color={brandColor} onClick={() => set("appliesTo", "collections")}>
                        Coleções específicas
                      </Toggle>
                    </div>
                  </div>

                  {form.appliesTo === "products" && (
                    <ItemPicker
                      brandId={brandId}
                      kind="products"
                      color={brandColor}
                      selected={form.products}
                      onChange={(items) => set("products", items)}
                    />
                  )}
                  {form.appliesTo === "collections" && (
                    <ItemPicker
                      brandId={brandId}
                      kind="collections"
                      color={brandColor}
                      selected={form.collections}
                      onChange={(items) => set("collections", items)}
                    />
                  )}
                </>
              )}

              {/* Mínimos e limites */}
              <div className="flex flex-wrap items-end gap-3">
                <div className="w-40">
                  <label className="label">Compra mínima (R$)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="input"
                    placeholder="sem mínimo"
                    value={form.minSubtotal}
                    onChange={(e) => set("minSubtotal", e.target.value)}
                  />
                </div>
                <div className="w-36">
                  <label className="label">Limite de usos</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className="input"
                    placeholder="ilimitado"
                    value={form.usageLimit}
                    onChange={(e) => set("usageLimit", e.target.value)}
                  />
                </div>
                <label className="flex items-center gap-2 pb-2 text-sm text-[var(--muted)]">
                  <input
                    type="checkbox"
                    checked={form.oncePerCustomer}
                    onChange={(e) => set("oncePerCustomer", e.target.checked)}
                  />
                  1x por cliente
                </label>
              </div>

              {state?.ok && (
                <div className="rounded-lg border border-[var(--success)] bg-[var(--brand-soft)] px-4 py-2 text-sm text-[var(--brand-dark)]">
                  Cupom configurado na Shopify. ✓
                </div>
              )}
              {state?.error && (
                <div className="rounded-lg border border-[var(--danger)] bg-[#fbe9e7] px-4 py-2 text-sm text-[var(--danger)]">
                  {state.error}
                </div>
              )}

              <form action={formAction}>
                <input type="hidden" name="creatorId" value={creatorId} />
                <input type="hidden" name="couponConfig" value={JSON.stringify(payload)} />
                <SubmitButton className="btn btn-primary" pendingLabel="Salvando na Shopify...">
                  Salvar configuração
                </SubmitButton>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Ao salvar, as regras são aplicadas na Shopify. O cupom é atualizado
                  no lugar (mantendo o contador de “usos”); ele só é recriado ao
                  trocar entre desconto e frete grátis, ou ao remover um mínimo que
                  existia. O histórico de vendas (por código) é sempre preservado.
                </p>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Toggle({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-4 py-1.5 text-sm font-medium transition"
      style={
        active
          ? { background: color, borderColor: color, color: "#fff" }
          : { borderColor: "var(--border)", color: "var(--muted)" }
      }
    >
      {children}
    </button>
  );
}

function ItemPicker({
  brandId,
  kind,
  color,
  selected,
  onChange,
}: {
  brandId: string;
  kind: "products" | "collections";
  color: string;
  selected: PickItem[];
  onChange: (items: PickItem[]) => void;
}) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<PickItem[]>([]);
  const [searching, setSearching] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (term.trim().length < 2) {
      setResults([]);
      return;
    }
    timer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const items = await searchShopifyItemsAction(brandId, kind, term.trim());
        setResults(items);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [term, brandId, kind]);

  const add = (item: PickItem) => {
    if (!selected.some((s) => s.id === item.id)) onChange([...selected, item]);
    setTerm("");
    setResults([]);
  };
  const remove = (id: string) => onChange(selected.filter((s) => s.id !== id));

  const label = kind === "products" ? "produtos" : "coleções";

  return (
    <div>
      <label className="label">Selecionar {label}</label>
      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selected.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm text-white"
              style={{ background: color }}
            >
              {s.title}
              <button type="button" onClick={() => remove(s.id)} className="font-bold">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        className="input"
        placeholder={`Buscar ${label} na Shopify…`}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      {searching && <p className="mt-1 text-xs text-[var(--muted)]">Buscando…</p>}
      {results.length > 0 && (
        <ul className="mt-2 max-h-52 overflow-y-auto rounded-lg border">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => add(r)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-[var(--brand-soft)]"
              >
                {r.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
