import "server-only";
import { redirect, notFound } from "next/navigation";
import { getCurrentAdmin } from "./auth";
import { getBrandBySlug } from "./brand";

// Garante um admin logado com acesso à marca do slug. Redireciona/404 se não.
export async function requireBrandAdmin(slug: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();
  if (admin.brandId && admin.brandId !== brand.id) redirect("/admin");

  return { admin, brand };
}
