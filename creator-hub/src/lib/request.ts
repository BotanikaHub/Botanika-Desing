import "server-only";
import { headers } from "next/headers";

/**
 * Origem (protocolo + host) da requisição atual — usada como fallback do link
 * de afiliado quando NEXT_PUBLIC_APP_URL não está definido, para nunca gerar um
 * link relativo/quebrado. Em produção (Vercel) os cabeçalhos x-forwarded-* vêm
 * preenchidos.
 */
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  if (!host) return "";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
