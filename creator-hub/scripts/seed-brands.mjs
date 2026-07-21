// Cria/atualiza as marcas do hub.
// Uso: node scripts/seed-brands.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const brands = [
  {
    slug: "botanika",
    name: "Botanika",
    tagline: "Você já recomenda o que ama. Com a Botanika, agora você ganha por isso.",
    primaryColor: "#2f6b3f",
    storeUrl: "https://botanikabrasil.com.br",
    shopDomain: "botanika-brasil.myshopify.com",
    defaultCommissionRate: 0.1,
  },
  {
    slug: "vermfree",
    name: "VermeFree",
    tagline: "Você já recomenda o que ama. Com a VermeFree, agora você ganha por isso.",
    primaryColor: "#1f6f8b",
    storeUrl: null,
    shopDomain: null,
    defaultCommissionRate: 0.1,
  },
];

for (const b of brands) {
  // Não tocamos em shopDomain/storeUrl no update — conexão Shopify é
  // definida/auto-detectada pelo admin e não deve ser sobrescrita aqui.
  const brand = await prisma.brand.upsert({
    where: { slug: b.slug },
    update: {
      name: b.name,
      tagline: b.tagline,
      primaryColor: b.primaryColor,
    },
    create: b,
  });
  console.log(`✓ Marca: ${brand.name} (/${brand.slug})`);
}

await prisma.$disconnect();
