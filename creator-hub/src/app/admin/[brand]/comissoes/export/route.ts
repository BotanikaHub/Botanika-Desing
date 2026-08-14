import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getBrandBySlug } from "@/lib/brand";
import { buildCommissionReport } from "@/lib/commission-report";
import { resolvePeriod } from "@/lib/format";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// GET /admin/[brand]/comissoes/export?period=&from=&to=  → CSV de comissões a pagar.
export async function GET(
  req: NextRequest,
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

  const sp = req.nextUrl.searchParams;
  const { since, until } = resolvePeriod(
    sp.get("period") ?? undefined,
    sp.get("from") ?? undefined,
    sp.get("to") ?? undefined,
  );

  const report = await buildCommissionReport(brand, { since, until });

  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const brl = (n: number) => n.toFixed(2).replace(".", ",");

  const header = ["Creator", "Cupom", "Pedidos", "Vendas (R$)", "Comissao %", "Comissao a pagar (R$)"];
  const lines = report.rows.map((r) =>
    [r.name, r.code, r.orders, brl(r.sales), r.ratePct, brl(r.commission)].map(esc).join(";"),
  );
  const total = ["TOTAL", "", report.totalOrders, brl(report.totalSales), "", brl(report.totalCommission)]
    .map(esc)
    .join(";");

  const periodLabel = since ? since.slice(0, 10) : "inicio";
  const periodEnd = until ? until.slice(0, 10) : "hoje";
  const info = `Periodo;${periodLabel} a ${periodEnd}`;

  const csv =
    "﻿" + [info, "", header.join(";"), ...lines, total].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="comissoes-${brand.slug}-${periodLabel}.csv"`,
    },
  });
}
