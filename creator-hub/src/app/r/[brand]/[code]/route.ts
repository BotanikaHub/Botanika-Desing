import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /r/MARCA/CUPOM → registra o clique e leva à loja da marca com o cupom
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ brand: string; code: string }> },
) {
  const { brand: slug, code } = await ctx.params;

  const brand = await prisma.brand.findUnique({
    where: { slug: slug.toLowerCase() },
  });

  const storeUrl = (brand?.storeUrl || "https://botanikabrasil.com.br").replace(/\/$/, "");
  const to = req.nextUrl.searchParams.get("to") || "";
  const safeTo = to.startsWith("/") ? to : "";

  if (!brand) return NextResponse.redirect(`${storeUrl}${safeTo}`);

  const creator = await prisma.creator.findUnique({
    where: {
      brandId_couponCode: { brandId: brand.id, couponCode: code.toUpperCase() },
    },
  });

  if (!creator || creator.status !== "APPROVED" || !creator.couponCode) {
    return NextResponse.redirect(`${storeUrl}${safeTo}`);
  }

  try {
    await prisma.click.create({
      data: {
        creatorId: creator.id,
        ip:
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          req.headers.get("x-real-ip") ||
          null,
        userAgent: req.headers.get("user-agent") || null,
        referrer: req.headers.get("referer") || null,
        landing: safeTo || null,
      },
    });
  } catch {
    // ignora falha de log
  }

  const redirectParam = safeTo ? `?redirect=${encodeURIComponent(safeTo)}` : "";
  return NextResponse.redirect(
    `${storeUrl}/discount/${creator.couponCode}${redirectParam}`,
  );
}
