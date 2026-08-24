import { prisma } from "@/lib/prisma";
import { requireBrandAdmin } from "@/lib/admin-brand";
import { BriefingSettings, type BriefingView } from "../../BriefingSettings";

export const dynamic = "force-dynamic";

export default async function BriefingsTab({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const { brand } = await requireBrandAdmin(slug);

  const banner = await prisma.brandAsset.findUnique({
    where: { brandId_kind: { brandId: brand.id, kind: "campaign_banner" } },
    select: { id: true },
  });

  const view: BriefingView = {
    id: brand.id,
    slug: brand.slug,
    color: brand.primaryColor,
    generalBriefing: brand.generalBriefing,
    generalBriefingUrl: brand.generalBriefingUrl,
    campaignActive: brand.campaignActive,
    campaignTitle: brand.campaignTitle,
    campaignBody: brand.campaignBody,
    campaignUrl: brand.campaignUrl,
    hasBanner: Boolean(banner),
  };

  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">Briefings</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">
        Conteúdo que a creator vê no painel: o briefing geral (fixo) e a campanha
        vigente (banner + orientações de stories/posts).
      </p>
      <BriefingSettings brand={view} />
    </section>
  );
}
