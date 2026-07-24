import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBrandBySlug } from "@/lib/brand";

// GET /admin/[brand]/lista-envio → CSV dos creators ativos p/ envio (termo assinado).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ brand: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) return new NextResponse("Não autorizado.", { status: 401 });

  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return new NextResponse("Marca não encontrada.", { status: 404 });
  if (admin.brandId && admin.brandId !== brand.id) {
    return new NextResponse("Sem permissão.", { status: 403 });
  }

  const creators = await prisma.creator.findMany({
    where: { brandId: brand.id, shippingActive: true },
    orderBy: { termsAcceptedAt: "desc" },
  });

  const headers = [
    "Nome",
    "Cupom",
    "CPF",
    "CEP",
    "Rua",
    "Numero",
    "Complemento",
    "Bairro",
    "Cidade",
    "UF",
    "Email",
    "Telefone",
    "Aceite em",
  ];

  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const rows = creators.map((c) =>
    [
      c.termsName || c.name,
      c.couponCode || "",
      c.termsCpf || "",
      c.shipCep || "",
      c.shipStreet || "",
      c.shipNumber || "",
      c.shipComplement || "",
      c.shipDistrict || "",
      c.shipCity || "",
      c.shipState || "",
      c.email.endsWith(".creatorclub") ? "" : c.email,
      c.phone || "",
      c.termsAcceptedAt ? c.termsAcceptedAt.toISOString().slice(0, 10) : "",
    ]
      .map(esc)
      .join(";"),
  );

  // BOM p/ acentos abrirem certo no Excel; separador ; (padrão BR).
  const csv = "﻿" + [headers.join(";"), ...rows].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lista-envio-${brand.slug}.csv"`,
    },
  });
}
