import { NextResponse } from "next/server";
import { getCurrentAdmin, getCurrentCreatorAccount } from "@/lib/auth";
import { getBrandBySlug } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /brand-asset/[slug]/[kind] → serve um arquivo da marca (ex.: banner da
// campanha). Acesso: admin da marca ou creator com participação nessa marca.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; kind: string }> },
) {
  const { slug, kind } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return new NextResponse("Marca não encontrada.", { status: 404 });

  // Autorização.
  const admin = await getCurrentAdmin();
  let allowed = false;
  if (admin) {
    allowed = !admin.brandId || admin.brandId === brand.id;
  } else {
    const account = await getCurrentCreatorAccount();
    allowed = Boolean(account?.creators.some((c) => c.brandId === brand.id));
  }
  if (!allowed) return new NextResponse("Não autorizado.", { status: 401 });

  const asset = await prisma.brandAsset.findUnique({
    where: { brandId_kind: { brandId: brand.id, kind } },
  });
  if (!asset) return new NextResponse("Arquivo não encontrado.", { status: 404 });

  return new NextResponse(new Uint8Array(asset.data), {
    headers: {
      "Content-Type": asset.mime || "application/octet-stream",
      "Cache-Control": "private, no-store",
    },
  });
}
