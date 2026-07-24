import { prisma } from "@/lib/prisma";
import { requireBrandAdmin } from "@/lib/admin-brand";
import { ApprovedCard, type ApprovedView } from "../../ApplicationCard";
import { summarizeCoupon } from "@/lib/coupon-summary";

export const dynamic = "force-dynamic";

export default async function CuponsTab({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const { brand } = await requireBrandAdmin(slug);

  const approved = await prisma.creator.findMany({
    where: { brandId: brand.id, status: "APPROVED" },
    orderBy: [{ claimed: "asc" }, { approvedAt: "desc" }],
  });

  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">
        Cupons <span className="text-[var(--muted)]">({approved.length})</span>
      </h1>
      <p className="mb-6 text-sm text-[var(--muted)]">
        Comissão, código e configuração do cupom na Shopify (valor, onde aplica,
        frete, mínimos e limites) e a meta individual de cada creator.
      </p>
      {approved.length === 0 ? (
        <div className="card text-sm text-[var(--muted)]">Nenhum creator ainda.</div>
      ) : (
        <div className="space-y-3">
          {approved.map((c) => (
            <ApprovedCard
              key={c.id}
              creator={
                {
                  id: c.id,
                  brandId: brand.id,
                  brandName: brand.name,
                  brandColor: brand.primaryColor,
                  name: c.name,
                  email: c.email,
                  couponCode: c.couponCode,
                  commissionRatePct: Math.round(c.commissionRate * 100),
                  discountPct:
                    c.couponDiscountRate != null
                      ? Math.round(c.couponDiscountRate * 100)
                      : null,
                  couponSummary: summarizeCoupon(c.couponConfig),
                  approvedAt: c.approvedAt ? c.approvedAt.toISOString() : null,
                  claimed: c.claimed,
                  termsSigned: Boolean(c.termsAcceptedAt),
                  goalAmount: c.goalAmount,
                  goalPlaceholder: brand.goalDefaultAmount,
                } satisfies ApprovedView
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
