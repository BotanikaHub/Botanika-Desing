import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getCurrentAdmin } from "@/lib/auth";
import { adminLogoutAction } from "@/actions/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Creator Club" };

export default async function AdminHome() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const brands = await prisma.brand.findMany({
    where: admin.brandId ? { id: admin.brandId } : {},
    orderBy: { name: "asc" },
  });

  // Admin de uma marca só → vai direto pra ela
  if (admin.brandId && brands.length === 1) {
    redirect(`/admin/${brands[0].slug}`);
  }

  const pendingByBrand = await prisma.creator.groupBy({
    by: ["brandId"],
    where: { status: "PENDING" },
    _count: { _all: true },
  });
  const pendingMap = new Map(
    pendingByBrand.map((p) => [p.brandId, p._count._all]),
  );

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

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
        <h1 className="text-2xl font-bold">Escolha a marca</h1>
        <p className="mt-1 text-[var(--muted)]">
          Cada marca tem sua própria área de gestão, isolada.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {brands.map((b) => {
            const pending = pendingMap.get(b.id) || 0;
            return (
              <Link
                key={b.id}
                href={`/admin/${b.slug}`}
                className="card flex items-center justify-between transition hover:shadow-md"
                style={{ borderColor: b.primaryColor }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ background: b.primaryColor }}
                  >
                    {b.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-lg font-semibold">{b.name}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {b.shopifyAccessToken ? "Shopify conectada" : "Shopify não conectada"}
                    </p>
                  </div>
                </div>
                {pending > 0 && (
                  <span className="badge badge-pending">{pending} pendente(s)</span>
                )}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
