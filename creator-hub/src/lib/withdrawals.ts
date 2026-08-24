import "server-only";
import type { Brand, Creator } from "@prisma/client";
import { prisma } from "./prisma";
import { brandConnection } from "./brand";
import { isShopifyConfigured } from "./shopify";
import { cachedCreatorSales } from "./shopify-cache";

export type WithdrawalSummary = {
  accumulatedSales: number; // vendas pagas acumuladas (produtos), todo o período
  commission: number; // comissão acumulada (accumulatedSales * taxa)
  paid: number; // já pago (saques confirmados)
  pending: number; // em análise (saques solicitados)
  available: number; // disponível para sacar
  minSales: number; // mínimo de vendas para liberar o saque
  eligible: boolean; // atingiu o mínimo de vendas?
  canRequest: boolean; // elegível + tem saldo + sem pedido em aberto
};

/**
 * Resumo de saque de um creator: comissão acumulada (da Shopify), quanto já foi
 * pago / está em análise, e o saldo disponível. A comissão é sobre o valor dos
 * produtos em pedidos pagos (todo o período).
 */
export async function getWithdrawalSummary(
  creator: Pick<Creator, "id" | "couponCode" | "commissionRate">,
  brand: Brand,
): Promise<WithdrawalSummary> {
  const conn = brandConnection(brand);
  let accumulatedSales = 0;
  if (isShopifyConfigured(conn) && creator.couponCode) {
    try {
      const s = await cachedCreatorSales(brand.id, conn, creator.couponCode, {});
      accumulatedSales = s.totalSales;
    } catch {
      accumulatedSales = 0;
    }
  }

  const commission = accumulatedSales * creator.commissionRate;

  const [paidAgg, pendingAgg] = await Promise.all([
    prisma.withdrawal.aggregate({
      where: { creatorId: creator.id, status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.withdrawal.aggregate({
      where: { creatorId: creator.id, status: "REQUESTED" },
      _sum: { amount: true },
    }),
  ]);
  const paid = paidAgg._sum.amount ?? 0;
  const pending = pendingAgg._sum.amount ?? 0;

  const available = Math.max(0, commission - paid - pending);
  const minSales = brand.withdrawalMinSales;
  const eligible = accumulatedSales >= minSales;
  const canRequest = eligible && available > 0 && pending === 0;

  return {
    accumulatedSales,
    commission,
    paid,
    pending,
    available,
    minSales,
    eligible,
    canRequest,
  };
}
