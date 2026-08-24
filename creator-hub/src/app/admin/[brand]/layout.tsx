import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireBrandAdmin } from "@/lib/admin-brand";
import { adminLogoutAction } from "@/actions/auth";
import { AdminTabs } from "./AdminTabs";

export const dynamic = "force-dynamic";

export default async function BrandAdminLayout({
  params,
  children,
}: {
  params: Promise<{ brand: string }>;
  children: React.ReactNode;
}) {
  const { brand: slug } = await params;
  const { brand } = await requireBrandAdmin(slug);

  const [pendingCount, withdrawalsCount] = await Promise.all([
    prisma.creator.count({
      where: { brandId: brand.id, status: "PENDING" },
    }),
    prisma.withdrawal.count({
      where: { status: "REQUESTED", creator: { brandId: brand.id } },
    }),
  ]);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ ["--brand" as string]: brand.primaryColor }}
    >
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-[var(--muted)] hover:underline">
              ← Marcas
            </Link>
            <span
              className="rounded-full px-3 py-1 text-sm font-bold text-white"
              style={{ background: brand.primaryColor }}
            >
              {brand.name}
            </span>
            <span className="badge badge-approved">Admin</span>
          </div>
          <form action={adminLogoutAction}>
            <button type="submit" className="btn btn-ghost">Sair</button>
          </form>
        </div>
        <AdminTabs
          slug={brand.slug}
          color={brand.primaryColor}
          pendingCount={pendingCount}
          withdrawalsCount={withdrawalsCount}
        />
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
