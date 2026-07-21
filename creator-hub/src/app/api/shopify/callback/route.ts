import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyState, verifyHmac, appUrl } from "@/lib/shopify-oauth";
import { exchangeOAuthCode } from "@/lib/shopify";

// GET /api/shopify/callback  → recebe o retorno do OAuth, troca code por token e salva
export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const { code, shop, state } = params;

  const back = (q: string) => NextResponse.redirect(`${appUrl()}/admin?${q}`);

  if (!code || !shop || !state) return back("error=callback-invalido");

  const st = await verifyState(state);
  if (!st) return back("error=state-invalido");

  const brand = await prisma.brand.findUnique({ where: { slug: st.slug } });
  if (!brand || !brand.shopifyApiKey || !brand.shopifyApiSecret) {
    return back("error=marca-sem-config");
  }

  // A loja precisa ser um domínio .myshopify.com válido
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop)) {
    return back("error=loja-invalida");
  }

  // Autenticidade garantida pelo HMAC (assinado com o Client Secret da marca)
  // + pelo state assinado. Aceitamos a loja que a Shopify confirmou e salvamos.
  if (!verifyHmac(params, brand.shopifyApiSecret)) {
    return back("error=hmac-invalido");
  }

  try {
    const { accessToken, scope } = await exchangeOAuthCode({
      shopDomain: shop,
      apiKey: brand.shopifyApiKey,
      apiSecret: brand.shopifyApiSecret,
      code,
    });

    await prisma.brand.update({
      where: { id: brand.id },
      data: {
        shopDomain: shop,
        shopifyAccessToken: accessToken,
        shopifyScope: scope,
        shopifyInstalledAt: new Date(),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "erro";
    return back(`error=${encodeURIComponent("token: " + msg)}`);
  }

  return back(`connected=${brand.slug}`);
}
