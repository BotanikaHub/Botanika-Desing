-- Campos para importação de cupons da Shopify e reivindicação de painel
ALTER TABLE "Creator" ADD COLUMN "claimed" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Creator" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'signup';
