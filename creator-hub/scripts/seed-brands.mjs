// Cria/atualiza as marcas do hub.
// Uso: node scripts/seed-brands.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const brands = [
  {
    slug: "botanika",
    name: "Botanika",
    tagline: "Divulgue a Botanika e ganhe comissão em cada venda",
    primaryColor: "#2f6b3f",
    storeUrl: "https://botanikabrasil.com.br",
    shopDomain: "botanika-brasil.myshopify.com",
    defaultCommissionRate: 0.1,
  },
  {
    slug: "vermfree",
    name: "Vermfree",
    tagline: "Divulgue a Vermfree e ganhe comissão em cada venda",
    primaryColor: "#1f6f8b",
    storeUrl: null,
    shopDomain: null,
    defaultCommissionRate: 0.1,
  },
];

for (const b of brands) {
  const brand = await prisma.brand.upsert({
    where: { slug: b.slug },
    update: {
      name: b.name,
      tagline: b.tagline,
      primaryColor: b.primaryColor,
      storeUrl: b.storeUrl,
      shopDomain: b.shopDomain,
      defaultCommissionRate: b.defaultCommissionRate,
    },
    create: b,
  });
  console.log(`✓ Marca: ${brand.name} (/${brand.slug})`);
}

await prisma.$disconnect();
