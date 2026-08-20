import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getBrandBySlug } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function BrandLanding({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const color = brand.primaryColor;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ ["--brand" as string]: color }}
    >
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Logo color={color} />
          <Link href={"/entrar"} className="btn btn-ghost">
            Já sou do clube
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-5 py-16 text-center">
          <span className="badge badge-approved mb-5">
            Creator Club · {brand.name}
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {brand.tagline ||
              `Você já recomenda o que ama. Com a ${brand.name}, agora você ganha por isso.`}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">
            Faça parte do time de creators da {brand.name}: cupom exclusivo,
            ganhos 100% transparentes e um painel só seu pra acompanhar cada
            venda em tempo real. Sem burocracia, sem planilha, sem achismo.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/${brand.slug}/apply`}
              className="btn btn-primary px-8 py-3.5 text-base"
            >
              Quero fazer parte
            </Link>
            <Link
              href={"/entrar"}
              className="btn btn-outline px-8 py-3.5 text-base"
            >
              Entrar no meu painel
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 pb-20">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Simples assim, do seu jeito
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Entre pro clube",
                d: "Conte um pouco sobre você e sua audiência. Leva 1 minuto — e é de graça.",
              },
              {
                n: "2",
                t: "Ganhe seu cupom",
                d: `Aprovado, você recebe um cupom e link exclusivos da ${brand.name} pra chamar de seus.`,
              },
              {
                n: "3",
                t: "Recomende e ganhe",
                d: "Compartilhe com quem confia em você e veja seus ganhos crescerem em tempo real.",
              },
            ].map((s) => (
              <div key={s.n} className="card">
                <span
                  className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full font-bold text-white"
                  style={{ background: color }}
                >
                  {s.n}
                </span>
                <h3 className="mb-1 text-lg font-semibold">{s.t}</h3>
                <p className="text-sm text-[var(--muted)]">{s.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-[var(--surface)] py-6 text-center text-sm text-[var(--muted)]">
        © 2026 {brand.name} · Creator Club
      </footer>
    </div>
  );
}
