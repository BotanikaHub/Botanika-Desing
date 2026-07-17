import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getBrandBySlug } from "@/lib/brand";
import { getCurrentCreator } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const creator = await getCurrentCreator();
  if (creator && creator.brandId === brand.id) redirect(`/${brand.slug}/dashboard`);

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
        <h1 className="text-2xl font-bold">Acesse seu painel</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Entre com o e-mail e a senha do seu cadastro na {brand.name}.
        </p>

        <div className="card mt-6">
          <LoginForm brandSlug={brand.slug} />
        </div>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Ainda não é afiliado?{" "}
          <Link href={`/${brand.slug}/apply`} className="font-semibold text-[var(--brand)]">
            Cadastre-se
          </Link>
        </p>
      </main>
    </div>
  );
}
