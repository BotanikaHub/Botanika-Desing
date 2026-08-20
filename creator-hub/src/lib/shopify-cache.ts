import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
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

// Tag por marca: as escritas do admin chamam revalidateShopify(brandId) para
// invalidar na hora (senão a tela ficaria desatualizada por até TTL).
export const shopifyTag = (brandId: string) => `shopify:${brandId}`;

/**
 * Invalida o cache de Shopify de uma marca após uma escrita (aprovar/editar/
 * remover creator, importar cupons). `expire: 0` força a expiração imediata,
 * para o admin ver a mudança já na próxima carga (e não só após o TTL).
 */
export function revalidateShopify(brandId: string): void {
  revalidateTag(shopifyTag(brandId), { expire: 0 });
}

// Hash estável do mapa de creators (código→nome/comissão). Entra na chave do
// analytics para que aprovar/editar um creator não sirva um mapeamento antigo.
function creatorsSignature(
  creatorsByCode: Record<string, { name: string; rate: number }>,
): string {
  return Object.keys(creatorsByCode)
    .sort()
    .map((code) => `${code}:${creatorsByCode[code].rate}`)
    .join("|");
}

export function cachedBrandAnalytics(
  brandId: string,
  conn: ShopifyConnection,
  creatorsByCode: Record<string, { name: string; rate: number }>,
  opts: PeriodOpts,
): Promise<BrandAnalytics> {
  return unstable_cache(
    () => getBrandAnalytics(conn, creatorsByCode, opts),
    ["shopify", "analytics", brandId, periodKey(opts), creatorsSignature(creatorsByCode)],
    { revalidate: TTL, tags: [shopifyTag(brandId)] },
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
    { revalidate: TTL, tags: [shopifyTag(brandId)] },
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
    { revalidate: TTL, tags: [shopifyTag(brandId)] },
  )();
}
