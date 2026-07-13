import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /r/CODIGO  → registra o clique e redireciona para a loja com o cupom aplicado
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;
  const storeUrl =
    process.env.NEXT_PUBLIC_STORE_URL?.replace(/\/$/, "") || "https://botanika.com.br";

  const creator = await prisma.creator.findUnique({
    where: { couponCode: code.toUpperCase() },
  });

  // Destino opcional: /r/CODE?to=/products/algum-produto
  const to = req.nextUrl.searchParams.get("to") || "";
  const safeTo = to.startsWith("/") ? to : "";

  if (!creator || creator.status !== "APPROVED") {
    // cupom inválido → manda para a loja mesmo assim
    return NextResponse.redirect(`${storeUrl}${safeTo}`);
  }

  // Registra o clique (não bloqueia o redirect se falhar)
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

  // URL de desconto da Shopify aplica o cupom automaticamente.
  // Formato: /discount/CODIGO?redirect=/caminho
  const redirectParam = safeTo ? `?redirect=${encodeURIComponent(safeTo)}` : "";
  return NextResponse.redirect(
    `${storeUrl}/discount/${creator.couponCode}${redirectParam}`,
  );
}
