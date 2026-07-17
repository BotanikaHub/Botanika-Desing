import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /r/CODIGO → registra o clique e redireciona à loja da marca com o cupom aplicado
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;

  const creator = await prisma.creator.findUnique({
    where: { couponCode: code.toUpperCase() },
    include: { brand: true },
  });

  const to = req.nextUrl.searchParams.get("to") || "";
  const safeTo = to.startsWith("/") ? to : "";

  const storeUrl = (creator?.brand.storeUrl || "https://botanikabrasil.com.br").replace(/\/$/, "");

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
