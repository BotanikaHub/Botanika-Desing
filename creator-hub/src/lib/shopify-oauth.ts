import "server-only";
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

/**
 * Fluxo OAuth da Shopify (por marca).
 * Cada marca tem seu próprio app no Dev Dashboard (apiKey/apiSecret) e sua loja.
 * O admin clica em "Conectar", instala na loja e recebemos um token offline.
 */

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-insecure-secret-change-me",
);

// read_products/read_product_listings: usados no seletor de produtos/coleções
// do editor de cupom (aplicar desconto em itens/coleções específicas).
export const SHOPIFY_SCOPES =
  "read_orders,write_discounts,read_discounts,read_products";

export function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

// Assina um "state" curto (anti-CSRF) contendo o slug da marca.
export async function signState(slug: string): Promise<string> {
  return new SignJWT({ slug })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(SECRET);
}

export async function verifyState(token: string): Promise<{ slug: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { slug: String(payload.slug) };
  } catch {
    return null;
  }
}

export function buildAuthorizeUrl(params: {
  shopDomain: string;
  apiKey: string;
  state: string;
}): string {
  const redirectUri = `${appUrl()}/api/shopify/callback`;
  const q = new URLSearchParams({
    client_id: params.apiKey,
    scope: SHOPIFY_SCOPES,
    redirect_uri: redirectUri,
    state: params.state,
  });
  return `https://${params.shopDomain}/admin/oauth/authorize?${q.toString()}`;
}

/**
 * Valida o HMAC que a Shopify envia no callback, usando o Client Secret da marca.
 */
export function verifyHmac(
  query: Record<string, string>,
  apiSecret: string,
): boolean {
  const { hmac, signature: _signature, ...rest } = query;
  void _signature;
  if (!hmac) return false;

  const message = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("&");

  const digest = crypto
    .createHmac("sha256", apiSecret)
    .update(message)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, "utf8"),
      Buffer.from(hmac, "utf8"),
    );
  } catch {
    return false;
  }
}
