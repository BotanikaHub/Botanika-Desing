import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getBrandBySlug } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function ObrigadoPage({
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

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <span
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white"
          style={{ background: brand.primaryColor }}
        >
          ✓
        </span>
        <h1 className="text-3xl font-bold">Cadastro enviado!</h1>
        <p className="mt-3 text-[var(--muted)]">
          Recebemos seus dados. Nossa equipe vai analisar e, assim que você for
          aprovado, poderá acessar seu painel de afiliado com cupom e link
          exclusivos.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href={`/${brand.slug}/login`} className="btn btn-primary">
            Acessar meu painel
          </Link>
          <Link href={`/${brand.slug}`} className="btn btn-ghost">
            Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  );
}
