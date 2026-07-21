import { redirect } from "next/navigation";

// Login unificado: redireciona para /entrar
export default async function BrandLoginRedirect() {
  redirect("/entrar");
}
