-- Cupom único por marca (não mais global): a mesma influencer pode ter o
-- mesmo cupom em marcas diferentes.
DROP INDEX IF EXISTS "Creator_couponCode_key";
CREATE UNIQUE INDEX "Creator_brandId_couponCode_key" ON "Creator"("brandId", "couponCode");
