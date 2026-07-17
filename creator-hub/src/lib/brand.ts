import "server-only";
import { prisma } from "./prisma";
import type { ShopifyConnection } from "./shopify";

export async function getBrandBySlug(slug: string) {
  return prisma.brand.findUnique({ where: { slug: slug.toLowerCase() } });
}

export async function listBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}

export type BrandRecord = NonNullable<Awaited<ReturnType<typeof getBrandBySlug>>>;

export function brandConnection(brand: {
  shopDomain: string | null;
  shopifyAccessToken: string | null;
}): ShopifyConnection {
  return {
    shopDomain: brand.shopDomain,
    accessToken: brand.shopifyAccessToken,
  };
}
