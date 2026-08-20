import "server-only";
import type { Brand } from "@prisma/client";
import { prisma } from "./prisma";
import { brandConnection } from "./brand";
import { isShopifyConfigured } from "./shopify";
import { cachedBrandAnalytics } from "./shopify-cache";

export type CommissionRow = {
  name: string;
  code: string;
  orders: number; // pedidos com o cupom (todos)
  paidOrders: number; // pedidos pagos
  sales: number; // valor dos PRODUTOS em pedidos pagos (base da comissão)
  ratePct: number;
  commission: number;
};

export type CommissionReport = {
  rows: CommissionRow[];
  totalSales: number;
  totalCommission: number;
  totalOrders: number; // todos os pedidos com cupom
  totalPaidOrders: number; // pedidos pagos
  connected: boolean;
  truncated: boolean; // varredura atingiu o teto → período pode estar incompleto
  error: string | null;
};

/**
 * Relatório de vendas e comissões por creator (a pagar), no período dado.
 * Base: pedidos que usaram o cupom de cada creator aprovado na loja da marca.
 */
export async function buildCommissionReport(
  brand: Brand,
  opts: { since?: string | null; until?: string | null },
): Promise<CommissionReport> {
  const approved = await prisma.creator.findMany({
    where: { brandId: brand.id, status: "APPROVED", couponCode: { not: null } },
    select: { name: true, couponCode: true, commissionRate: true },
  });

  const conn = brandConnection(brand);
  const connected = isShopifyConfigured(conn);
  let salesByCode: Record<
    string,
    { orders: number; paidOrders: number; sales: number; paidSales: number }
  > = {};
  let ordersScanned = 0;
  let error: string | null = null;

  if (connected && approved.length > 0) {
    const creatorsByCode: Record<string, { name: string; rate: number }> = {};
    for (const c of approved) {
      if (c.couponCode) {
        creatorsByCode[c.couponCode.toUpperCase()] = {
          name: c.name,
          rate: c.commissionRate,
        };
      }
    }
    try {
      const a = await cachedBrandAnalytics(brand.id, conn, creatorsByCode, opts);
      salesByCode = a.salesByCode;
      ordersScanned = a.ordersScanned;
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao carregar as vendas.";
    }
  }

  const rows: CommissionRow[] = approved
    .map((c) => {
      const s = salesByCode[(c.couponCode || "").toUpperCase()] || {
        orders: 0,
        paidOrders: 0,
        sales: 0,
        paidSales: 0,
      };
      // Base da comissão: valor dos produtos em pedidos PAGOS.
      return {
        name: c.name,
        code: c.couponCode || "",
        orders: s.orders,
        paidOrders: s.paidOrders,
        sales: s.paidSales,
        ratePct: Math.round(c.commissionRate * 100),
        commission: s.paidSales * c.commissionRate,
      };
    })
    .sort((a, b) => b.commission - a.commission);

  return {
    rows,
    totalSales: rows.reduce((a, b) => a + b.sales, 0),
    totalCommission: rows.reduce((a, b) => a + b.commission, 0),
    totalOrders: rows.reduce((a, b) => a + b.orders, 0),
    totalPaidOrders: rows.reduce((a, b) => a + b.paidOrders, 0),
    connected,
    truncated: ordersScanned >= 1000,
    error,
  };
}
