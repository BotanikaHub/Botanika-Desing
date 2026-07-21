import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { buildAuthorizeUrl, signState, appUrl } from "@/lib/shopify-oauth";

// GET /api/shopify/install?brand=slug  → inicia o OAuth da marca
export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.redirect(`${appUrl()}/admin/login`);
  }

  const slug = req.nextUrl.searchParams.get("brand") || "";
  const brand = await prisma.brand.findUnique({ where: { slug: slug.toLowerCase() } });

  if (!brand) {
    return NextResponse.redirect(`${appUrl()}/admin?error=marca-nao-encontrada`);
  }
  // Admin de marca só conecta a própria marca
  if (admin.brandId && admin.brandId !== brand.id) {
    return NextResponse.redirect(`${appUrl()}/admin?error=sem-permissao`);
  }
  if (!brand.shopDomain || !brand.shopifyApiKey) {
    return NextResponse.redirect(
      `${appUrl()}/admin/${brand.slug}?error=configure-shopify-primeiro`,
    );
  }

  const state = await signState(brand.slug);
  const url = buildAuthorizeUrl({
    shopDomain: brand.shopDomain,
    apiKey: brand.shopifyApiKey,
    state,
  });
  return NextResponse.redirect(url);
}
