import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ApplyForm } from "./ApplyForm";

export const metadata = { title: "Cadastro de Creator · Botanika" };

export default function ApplyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/login" className="btn btn-ghost">
            Já sou afiliado
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Seja um creator Botanika</h1>
        <p className="mt-2 text-[var(--muted)]">
          Preencha seus dados abaixo. É rápido — depois da aprovação você recebe
          seu painel com cupom e link exclusivos.
        </p>

        <div className="card mt-8">
          <ApplyForm />
        </div>
      </main>
    </div>
  );
}
