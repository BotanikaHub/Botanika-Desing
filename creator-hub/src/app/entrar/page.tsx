import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getCurrentCreatorAccount } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Entrar · Creator Club" };

export default async function EntrarPage() {
  const account = await getCurrentCreatorAccount();
  if (account) redirect("/painel");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-[var(--surface)]">
        <div className="mx-auto flex max-w-3xl items-center px-5 py-4">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
        <h1 className="text-2xl font-bold">Entrar no Creator Club</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Um acesso só para todas as marcas que você divulga.
        </p>

        <div className="card mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Tem um cupom e é a primeira vez? Ative seu painel na página da marca
          (ex.: <span className="font-mono">/botanika/reivindicar</span>).
        </p>
      </main>
    </div>
  );
}
