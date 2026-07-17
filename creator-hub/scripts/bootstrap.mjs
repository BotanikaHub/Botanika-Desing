// Bootstrap idempotente, roda no deploy (Vercel):
//  - garante as marcas (Botanika, Vermfree)
//  - garante um admin a partir de ADMIN_EMAIL / ADMIN_PASSWORD (se definidos)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  await prisma.brand.upsert({
    where: { slug: b.slug },
    update: {
      name: b.name,
      tagline: b.tagline,
      primaryColor: b.primaryColor,
      storeUrl: b.storeUrl ?? undefined,
      shopDomain: b.shopDomain ?? undefined,
      defaultCommissionRate: b.defaultCommissionRate,
    },
    create: b,
  });
  console.log(`✓ Marca garantida: ${b.name}`);
}

const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Admin";

if (email && password) {
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });
  console.log(`✓ Admin garantido: ${email}`);
} else {
  console.log("· ADMIN_EMAIL/ADMIN_PASSWORD não definidos — pulei criação de admin.");
}

await prisma.$disconnect();
