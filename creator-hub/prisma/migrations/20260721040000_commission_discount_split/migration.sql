-- Separa a comissão da creator (interna) do desconto do cupom (cliente/Shopify).
-- Novos padrões: comissão 15%, desconto do cupom 5%.

ALTER TABLE "Brand" ALTER COLUMN "defaultCommissionRate" SET DEFAULT 0.15;
ALTER TABLE "Brand" ADD COLUMN "defaultDiscountRate" DOUBLE PRECISION NOT NULL DEFAULT 0.05;

ALTER TABLE "Creator" ALTER COLUMN "commissionRate" SET DEFAULT 0.15;
ALTER TABLE "Creator" ADD COLUMN "couponDiscountRate" DOUBLE PRECISION;

-- Padroniza o que já existe: todas as marcas e creators passam a 15% de comissão.
-- (O desconto real dos cupons permanece intacto na Shopify; aqui fica NULL até
--  ser definido/editado pelo admin.)
UPDATE "Brand" SET "defaultCommissionRate" = 0.15;
UPDATE "Creator" SET "commissionRate" = 0.15;
