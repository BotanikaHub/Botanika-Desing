-- Remetente de e-mail por marca (multi-marca, isolado por empresa).
-- Ex.: "Botanika Creator Club <creators@botanikabrasil.com.br>".
ALTER TABLE "Brand" ADD COLUMN "emailFrom" TEXT;
