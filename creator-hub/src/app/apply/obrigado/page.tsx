import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Cadastro enviado · Botanika" };

export default function ObrigadoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-3xl items-center px-5 py-4">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <span
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full text-3xl text-[var(--brand-contrast)]"
          style={{ background: "var(--brand)" }}
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
          <Link href="/login" className="btn btn-primary">
            Acessar meu painel
          </Link>
          <Link href="/" className="btn btn-ghost">
            Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  );
}
