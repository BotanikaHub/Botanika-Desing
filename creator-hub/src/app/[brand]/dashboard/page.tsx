import { redirect } from "next/navigation";

// Painel unificado: redireciona para /painel/[marca]
export default async function BrandDashboardRedirect({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  redirect(`/painel/${brand}`);
}
