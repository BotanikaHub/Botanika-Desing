import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getCurrentCreator } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Entrar · Botanika Creators" };

export default async function LoginPage() {
  const creator = await getCurrentCreator();
  if (creator) redirect("/dashboard");

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
        <h1 className="text-2xl font-bold">Acesse seu painel</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Entre com o e-mail e a senha do seu cadastro.
        </p>

        <div className="card mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Ainda não é afiliado?{" "}
          <Link href="/apply" className="font-semibold text-[var(--brand)]">
            Cadastre-se
          </Link>
        </p>
      </main>
    </div>
  );
}
