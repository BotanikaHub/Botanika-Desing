-- Ficha completa do creator: dados pessoais/contrato + checklist interno.
ALTER TABLE "Creator"
  ADD COLUMN "cpf" TEXT,
  ADD COLUMN "pixKey" TEXT,
  ADD COLUMN "birthDate" TEXT,
  ADD COLUMN "contractStart" TEXT,
  ADD COLUMN "contractEnd" TEXT,
  ADD COLUMN "notes" TEXT,
  ADD COLUMN "followsInstagram" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "inGroup" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "contractSigned" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "tagged" BOOLEAN NOT NULL DEFAULT false;
