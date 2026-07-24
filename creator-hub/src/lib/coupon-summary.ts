import { formatBRL } from "./format";

// Resumo curto da config do cupom (para exibir no card do creator).
export function summarizeCoupon(cfg: unknown): string | null {
  if (!cfg || typeof cfg !== "object") return null;
  const c = cfg as Record<string, unknown>;
  if (c.kind === "free_shipping") return "Frete grátis";
  const vt = c.valueType === "fixed" ? "fixed" : "percentage";
  const value = typeof c.value === "number" ? c.value : 0;
  const val = vt === "percentage" ? `${Math.round(value * 100)}%` : formatBRL(value);
  const where =
    c.appliesTo === "products"
      ? `em ${(c.productIds as unknown[])?.length || 0} produto(s)`
      : c.appliesTo === "collections"
        ? `em ${(c.collectionIds as unknown[])?.length || 0} coleção(ões)`
        : "no pedido";
  return `${val} ${where}`;
}
