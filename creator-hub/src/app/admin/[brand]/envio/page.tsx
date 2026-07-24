import { prisma } from "@/lib/prisma";
import { requireBrandAdmin } from "@/lib/admin-brand";

export const dynamic = "force-dynamic";

export default async function EnvioTab({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const { brand } = await requireBrandAdmin(slug);

  const shipping = await prisma.creator.findMany({
    where: { brandId: brand.id, shippingActive: true },
    orderBy: { termsAcceptedAt: "desc" },
  });

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">
          Lista de envio{" "}
          <span className="text-[var(--muted)]">({shipping.length})</span>
        </h1>
        {shipping.length > 0 && (
          <a
            href={`/admin/${brand.slug}/lista-envio`}
            className="btn btn-outline"
            download
          >
            Exportar CSV
          </a>
        )}
      </div>
      <p className="mb-6 text-sm text-[var(--muted)]">
        Creators que aceitaram o termo e confirmaram o endereço. Exporte o CSV
        para a logística.
      </p>

      {shipping.length === 0 ? (
        <div className="card text-sm text-[var(--muted)]">
          Ninguém ativo ainda. Creators entram aqui ao aceitar o termo e confirmar
          o endereço no painel.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-[var(--muted)]">
                <th className="py-2 pr-4 font-medium">Nome</th>
                <th className="py-2 pr-4 font-medium">Cupom</th>
                <th className="py-2 pr-4 font-medium">Endereço</th>
                <th className="py-2 pr-4 font-medium">Cidade/UF</th>
                <th className="py-2 pr-4 font-medium">CEP</th>
                <th className="py-2 font-medium">Aceite</th>
              </tr>
            </thead>
            <tbody>
              {shipping.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{c.termsName || c.name}</td>
                  <td className="py-2 pr-4 font-mono">{c.couponCode}</td>
                  <td className="py-2 pr-4">
                    {c.shipStreet
                      ? `${c.shipStreet}, ${c.shipNumber ?? ""}${c.shipComplement ? " · " + c.shipComplement : ""}${c.shipDistrict ? " · " + c.shipDistrict : ""}`
                      : "—"}
                  </td>
                  <td className="py-2 pr-4">
                    {c.shipCity ? `${c.shipCity}/${c.shipState ?? ""}` : "—"}
                  </td>
                  <td className="py-2 pr-4">{c.shipCep || "—"}</td>
                  <td className="py-2 text-[var(--muted)]">
                    {c.termsAcceptedAt
                      ? c.termsAcceptedAt.toISOString().slice(0, 10)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
