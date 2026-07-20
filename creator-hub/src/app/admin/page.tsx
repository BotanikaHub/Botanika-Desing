import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getCurrentAdmin } from "@/lib/auth";
import { adminLogoutAction } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { PendingCard, type CreatorView } from "./ApplicationCard";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Creator Club" };

type CreatorWithBrand = Prisma.CreatorGetPayload<{ include: { brand: true } }>;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const sp = await searchParams;
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  // Super admin vê todas; admin de marca fica restrito à sua.
  const selectedSlug = admin.brandId
    ? brands.find((b) => b.id === admin.brandId)?.slug
    : sp.brand;
  const selectedBrand = selectedSlug
    ? brands.find((b) => b.slug === selectedSlug)
    : undefined;

  const where: Prisma.CreatorWhereInput = selectedBrand
    ? { brandId: selectedBrand.id }
    : admin.brandId
      ? { brandId: admin.brandId }
      : {};

  const [pending, approved, rejected] = await Promise.all([
    prisma.creator.findMany({ where: { ...where, status: "PENDING" }, orderBy: { createdAt: "asc" }, include: { brand: true } }),
    prisma.creator.findMany({ where: { ...where, status: "APPROVED" }, orderBy: { approvedAt: "desc" }, include: { brand: true } }),
    prisma.creator.findMany({ where: { ...where, status: "REJECTED" }, orderBy: { updatedAt: "desc" }, include: { brand: true } }),
  ]);

  const toView = (c: CreatorWithBrand): CreatorView => ({
    id: c.id,
    brandName: c.brand.name,
    brandColor: c.brand.primaryColor,
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
    defaultRatePct: Math.round(c.brand.defaultCommissionRate * 100),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="badge badge-approved">Admin</span>
          </div>
          <form action={adminLogoutAction}>
            <button type="submit" className="btn btn-ghost">Sair</button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        {/* Filtro por marca (apenas super admin) */}
        {!admin.brandId && brands.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <BrandTab label="Todas as marcas" href="/admin" active={!selectedBrand} />
            {brands.map((b) => (
              <BrandTab
                key={b.id}
                label={b.name}
                href={`/admin?brand=${b.slug}`}
                active={selectedBrand?.id === b.id}
                color={b.primaryColor}
              />
            ))}
          </div>
        )}

        <div className="mb-8 grid grid-cols-3 gap-4">
          <SummaryStat label="Pendentes" value={pending.length} highlight />
          <SummaryStat label="Aprovados" value={approved.length} />
          <SummaryStat label="Recusados" value={rejected.length} />
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">
            Cadastros pendentes <span className="text-[var(--muted)]">({pending.length})</span>
          </h2>
          {pending.length === 0 ? (
            <div className="card text-sm text-[var(--muted)]">Nenhum cadastro pendente no momento.</div>
          ) : (
            <div className="space-y-4">
              {pending.map((c) => (
                <PendingCard key={c.id} creator={toView(c)} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">
            Afiliados aprovados <span className="text-[var(--muted)]">({approved.length})</span>
          </h2>
          {approved.length === 0 ? (
            <div className="card text-sm text-[var(--muted)]">Nenhum afiliado aprovado ainda.</div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-[var(--muted)]">
                    <th className="py-2 pr-4 font-medium">Marca</th>
                    <th className="py-2 pr-4 font-medium">Nome</th>
                    <th className="py-2 pr-4 font-medium">Cupom</th>
                    <th className="py-2 pr-4 font-medium">Comissão</th>
                    <th className="py-2 pr-4 font-medium">Contato</th>
                    <th className="py-2 font-medium">Aprovado em</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: c.brand.primaryColor }}>
                          {c.brand.name}
                        </span>
                      </td>
                      <td className="py-2 pr-4 font-medium">{c.name}</td>
                      <td className="py-2 pr-4"><span className="font-mono font-semibold text-[var(--brand)]">{c.couponCode}</span></td>
                      <td className="py-2 pr-4">{Math.round(c.commissionRate * 100)}%</td>
                      <td className="py-2 pr-4">{c.email}</td>
                      <td className="py-2">{c.approvedAt ? formatDate(c.approvedAt) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <span className="font-medium">
                    <span className="mr-2 text-xs text-[var(--muted)]">{c.brand.name}</span>
                    {c.name}
                  </span>
                  <span className="text-[var(--muted)]">{c.rejectionReason || "Sem motivo informado"}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function BrandTab({
  label,
  href,
  active,
  color,
}: {
  label: string;
  href: string;
  active: boolean;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-full border px-4 py-1.5 text-sm font-semibold transition"
      style={
        active
          ? { background: color || "var(--brand)", color: "#fff", borderColor: color || "var(--brand)" }
          : undefined
      }
    >
      {label}
    </Link>
  );
}

function SummaryStat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="card text-center" style={highlight && value > 0 ? { borderColor: "var(--warning)" } : undefined}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}
