import Link from "next/link";
import { listBrands } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function Home() {
  const brands = await listBrands();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-2xl text-center">
        <span className="badge badge-approved mb-4">Creator Club</span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          O clube de quem transforma influência em renda
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Parcerias com as marcas que você ama, ganhos transparentes e um painel
          só seu. Escolha por qual marca você quer começar.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {brands.length === 0 && (
            <p className="text-sm text-[var(--muted)]">
              Nenhuma marca disponível ainda.
            </p>
          )}
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/${b.slug}`}
              className="card flex flex-col items-center gap-3 transition hover:shadow-md"
              style={{ borderColor: b.primaryColor }}
            >
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ background: b.primaryColor }}
              >
                {b.name.charAt(0)}
              </span>
              <span className="text-lg font-semibold">{b.name}</span>
              <span className="text-sm font-semibold" style={{ color: b.primaryColor }}>
                Fazer parte →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-xs text-[var(--muted)]">
          Área da equipe?{" "}
          <Link href="/admin" className="font-semibold text-[var(--brand)]">
            Painel administrativo
          </Link>
        </p>
      </div>
    </div>
  );
}
