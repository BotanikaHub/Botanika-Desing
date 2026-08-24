-- Briefings por marca + banner da campanha (arquivo em tabela separada).
ALTER TABLE "Brand"
  ADD COLUMN "generalBriefing" TEXT,
  ADD COLUMN "generalBriefingUrl" TEXT,
  ADD COLUMN "campaignActive" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "campaignTitle" TEXT,
  ADD COLUMN "campaignBody" TEXT,
  ADD COLUMN "campaignUrl" TEXT;

CREATE TABLE "BrandAsset" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT,
    "mime" TEXT,
    "data" BYTEA NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BrandAsset_brandId_kind_key" ON "BrandAsset"("brandId", "kind");

ALTER TABLE "BrandAsset"
  ADD CONSTRAINT "BrandAsset_brandId_fkey"
  FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
