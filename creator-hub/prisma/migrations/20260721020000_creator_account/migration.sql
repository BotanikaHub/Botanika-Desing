-- Conta unificada da influencer (login único que agrupa marcas)
CREATE TABLE "CreatorAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CreatorAccount_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CreatorAccount_email_key" ON "CreatorAccount"("email");

ALTER TABLE "Creator" ADD COLUMN "accountId" TEXT;
CREATE INDEX "Creator_accountId_idx" ON "Creator"("accountId");
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "CreatorAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
