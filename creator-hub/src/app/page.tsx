import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Logo />
          <Link href="/login" className="btn btn-ghost">
            Já sou afiliado
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-5 py-16 text-center">
          <span className="badge badge-approved mb-5">
            Programa de Creators
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Divulgue a Botanika e ganhe comissão em cada venda
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">
            Cadastre-se como creator, receba seu cupom e link exclusivos e
            acompanhe suas vendas e comissões num painel só seu.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/apply" className="btn btn-primary px-8 py-3.5 text-base">
              Quero ser afiliado
            </Link>
            <Link href="/login" className="btn btn-outline px-8 py-3.5 text-base">
              Acessar meu painel
            </Link>
          </div>
        </section>

        {/* Como funciona */}
        <section className="mx-auto max-w-5xl px-5 pb-20">
          <h2 className="mb-8 text-center text-2xl font-bold">Como funciona</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Cadastre-se",
                d: "Preencha o formulário com seus dados e redes sociais. É rápido.",
              },
              {
                n: "2",
                t: "Seja aprovado",
                d: "Nossa equipe analisa e libera seu acesso com cupom e link exclusivos.",
              },
              {
                n: "3",
                t: "Divulgue e ganhe",
                d: "Compartilhe seu cupom/link. A cada venda, você acompanha a comissão no painel.",
              },
            ].map((s) => (
              <div key={s.n} className="card">
                <span
                  className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full font-bold text-[var(--brand-contrast)]"
                  style={{ background: "var(--brand)" }}
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
        © 2026 Botanika · Programa de Creators
      </footer>
    </div>
  );
}
