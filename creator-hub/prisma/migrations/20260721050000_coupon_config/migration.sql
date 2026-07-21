-- Configuração completa do cupom (tipo de valor, onde aplica, produtos/coleções,
-- frete grátis, mínimos e limites) — espelho do que é salvo na Shopify.
ALTER TABLE "Creator" ADD COLUMN "couponConfig" JSONB;
