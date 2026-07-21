import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getBrandBySlug } from "@/lib/brand";
import { ClaimForm } from "./ClaimForm";

export const dynamic = "force-dynamic";

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ ["--brand" as string]: brand.primaryColor }}
    >
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-3xl items-center px-5 py-4">
          <Link href={`/${brand.slug}`}>
            <Logo brandName={brand.name} color={brand.primaryColor} />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
        <h1 className="text-2xl font-bold">Ative o painel do seu cupom</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Já divulga a {brand.name} e tem um cupom? Informe o código, seu e-mail e
          crie uma senha para acessar seu painel com suas vendas.
        </p>

        <div className="card mt-6">
          <ClaimForm brandSlug={brand.slug} />
        </div>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Já ativou seu painel?{" "}
          <Link href={"/entrar"} className="font-semibold text-[var(--brand)]">
            Entrar
          </Link>
        </p>
      </main>
    </div>
  );
}
