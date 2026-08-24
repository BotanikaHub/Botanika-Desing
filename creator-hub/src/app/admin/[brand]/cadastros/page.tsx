import { prisma } from "@/lib/prisma";
import { requireBrandAdmin } from "@/lib/admin-brand";
import { PendingCard, type CreatorView } from "../../ApplicationCard";

export const dynamic = "force-dynamic";

export default async function CadastrosTab({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const { brand } = await requireBrandAdmin(slug);

  const [pending, rejected] = await Promise.all([
    prisma.creator.findMany({
      where: { brandId: brand.id, status: "PENDING" },
      orderBy: { createdAt: "asc" },
    }),
    prisma.creator.findMany({
      where: { brandId: brand.id, status: "REJECTED" },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const addressOf = (c: (typeof pending)[number]): string | null => {
    const parts = [
      [c.shipStreet, c.shipNumber].filter(Boolean).join(", "),
      c.shipComplement,
      c.shipDistrict,
      [c.shipCity, c.shipState].filter(Boolean).join("/"),
      c.shipCep,
    ].filter(Boolean);
    return parts.length ? parts.join(" · ") : null;
  };

  const toPending = (c: (typeof pending)[number]): CreatorView => ({
    id: c.id,
    brandName: brand.name,
    brandColor: brand.primaryColor,
    name: c.name,
    email: c.email,
    phone: c.phone,
    instagram: c.instagram,
    tiktok: c.tiktok,
    followers: c.followers,
    niche: c.niche,
    profession: c.profession,
    city: c.city,
    pitch: c.pitch,
    desiredCoupon: c.desiredCoupon,
    cpf: c.cpf ?? c.termsCpf,
    pixKey: c.pixKey,
    birthDate: c.birthDate,
    address: addressOf(c),
    defaultRatePct: Math.round(brand.defaultCommissionRate * 100),
    defaultDiscountPct: Math.round(brand.defaultDiscountRate * 100),
  });

  return (
    <>
      <section className="mb-10">
        <h1 className="mb-4 text-2xl font-bold">
          Cadastros pendentes{" "}
          <span className="text-[var(--muted)]">({pending.length})</span>
        </h1>
        {pending.length === 0 ? (
          <div className="card text-sm text-[var(--muted)]">Nenhum cadastro pendente.</div>
        ) : (
          <div className="space-y-4">
            {pending.map((c) => (
              <PendingCard key={c.id} creator={toPending(c)} />
            ))}
          </div>
        )}
      </section>

      {rejected.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">
            Recusados <span className="text-[var(--muted)]">({rejected.length})</span>
          </h2>
          <div className="card space-y-2 text-sm">
            {rejected.map((c) => (
              <div key={c.id} className="flex justify-between border-b pb-2 last:border-0 last:pb-0">
                <span className="font-medium">{c.name}</span>
                <span className="text-[var(--muted)]">
                  {c.rejectionReason || "Sem motivo informado"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
