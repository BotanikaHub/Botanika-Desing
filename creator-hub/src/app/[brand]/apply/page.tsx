import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getBrandBySlug } from "@/lib/brand";
import { ApplyForm } from "./ApplyForm";

export const dynamic = "force-dynamic";

export default async function ApplyPage({
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
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href={`/${brand.slug}`}>
            <Logo brandName={brand.name} color={brand.primaryColor} />
          </Link>
          <Link href={"/entrar"} className="btn btn-ghost">
            Já sou do clube
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Entre pro clube de creators da {brand.name}
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Conte um pouco sobre você e sua audiência. Assim que aprovado, você
          recebe cupom e link exclusivos e um painel só seu pra acompanhar cada
          venda em tempo real.
        </p>

        <div className="card mt-8">
          <ApplyForm brandSlug={brand.slug} />
        </div>
      </main>
    </div>
  );
}
