-- Bloco A (funil): termo de aceite eletrônico + endereço/CPF + lista de envio.
-- Bloco B (gamificação): meta + bônus configuráveis por marca (e override por creator).

-- Brand: termo + gamificação
ALTER TABLE "Brand" ADD COLUMN "termTitle" TEXT;
ALTER TABLE "Brand" ADD COLUMN "termBody" TEXT;
ALTER TABLE "Brand" ADD COLUMN "termVersion" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Brand" ADD COLUMN "goalPeriod" TEXT NOT NULL DEFAULT 'monthly';
ALTER TABLE "Brand" ADD COLUMN "goalDefaultAmount" DOUBLE PRECISION NOT NULL DEFAULT 3000;
ALTER TABLE "Brand" ADD COLUMN "bonusStepAmount" DOUBLE PRECISION NOT NULL DEFAULT 1000;
ALTER TABLE "Brand" ADD COLUMN "bonusLabel" TEXT NOT NULL DEFAULT 'bônus';

-- Creator: meta individual + termo + endereço + lista de envio
ALTER TABLE "Creator" ADD COLUMN "goalAmount" DOUBLE PRECISION;
ALTER TABLE "Creator" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3);
ALTER TABLE "Creator" ADD COLUMN "termsVersion" INTEGER;
ALTER TABLE "Creator" ADD COLUMN "termsName" TEXT;
ALTER TABLE "Creator" ADD COLUMN "termsCpf" TEXT;
ALTER TABLE "Creator" ADD COLUMN "termsIp" TEXT;
ALTER TABLE "Creator" ADD COLUMN "shipCep" TEXT;
ALTER TABLE "Creator" ADD COLUMN "shipStreet" TEXT;
ALTER TABLE "Creator" ADD COLUMN "shipNumber" TEXT;
ALTER TABLE "Creator" ADD COLUMN "shipComplement" TEXT;
ALTER TABLE "Creator" ADD COLUMN "shipDistrict" TEXT;
ALTER TABLE "Creator" ADD COLUMN "shipCity" TEXT;
ALTER TABLE "Creator" ADD COLUMN "shipState" TEXT;
ALTER TABLE "Creator" ADD COLUMN "shippingActive" BOOLEAN NOT NULL DEFAULT false;
