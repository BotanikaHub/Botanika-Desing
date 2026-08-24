import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getBrandBySlug } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /admin/[brand]/saques/nf/[id] → baixa a Nota Fiscal anexada ao saque.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ brand: string; id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) return new NextResponse("Não autorizado.", { status: 401 });

  const { brand: slug, id } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return new NextResponse("Marca não encontrada.", { status: 404 });
  if (admin.brandId && admin.brandId !== brand.id) {
    return new NextResponse("Sem permissão.", { status: 403 });
  }

  const w = await prisma.withdrawal.findUnique({
    where: { id },
    include: { creator: { select: { brandId: true } } },
  });
  if (!w || w.creator.brandId !== brand.id || !w.nfData) {
    return new NextResponse("Nota fiscal não encontrada.", { status: 404 });
  }

  const body = new Uint8Array(w.nfData);
  return new NextResponse(body, {
    headers: {
      "Content-Type": w.nfMime || "application/octet-stream",
      "Content-Disposition": `inline; filename="${(w.nfName || "nota-fiscal").replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
