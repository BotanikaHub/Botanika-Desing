import "server-only";
import { unstable_cache } from "next/cache";
import {
  getBrandAnalytics,
  getCreatorSales,
  getOrdersByDiscountCode,
  type ShopifyConnection,
  type BrandAnalytics,
  type CreatorSales,
  type OrderStats,
} from "./shopify";

/**
 * Wrappers cacheados das leituras pesadas da Shopify (varrem centenas de
 * pedidos). Sem isto, cada visita às telas de Vendas/Metas/painel refazia a
 * varredura inteira. Com o cache, a 1ª carga popula e as próximas (por até
 * TTL) são instantâneas. Chave por marca + cupom + período.
 */
const TTL = 180; // segundos

type PeriodOpts = { since?: string | null; until?: string | null };
const periodKey = (o: PeriodOpts) => `${o.since ?? "0"}_${o.until ?? "0"}`;

export function cachedBrandAnalytics(
  brandId: string,
  conn: ShopifyConnection,
  creatorsByCode: Record<string, { name: string; rate: number }>,
  opts: PeriodOpts,
): Promise<BrandAnalytics> {
  return unstable_cache(
    () => getBrandAnalytics(conn, creatorsByCode, opts),
    ["shopify", "analytics", brandId, periodKey(opts)],
    { revalidate: TTL },
  )();
}

export function cachedCreatorSales(
  brandId: string,
  conn: ShopifyConnection,
  code: string,
  opts: PeriodOpts,
): Promise<CreatorSales> {
  return unstable_cache(
    () => getCreatorSales(conn, code, opts),
    ["shopify", "creator-sales", brandId, code.toUpperCase(), periodKey(opts)],
    { revalidate: TTL },
  )();
}

export function cachedOrders(
  brandId: string,
  conn: ShopifyConnection,
  code: string,
  opts: PeriodOpts,
): Promise<OrderStats> {
  return unstable_cache(
    () => getOrdersByDiscountCode(conn, code, opts),
    ["shopify", "orders", brandId, code.toUpperCase(), periodKey(opts)],
    { revalidate: TTL },
  )();
}
