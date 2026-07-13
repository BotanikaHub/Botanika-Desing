// Cria (ou atualiza a senha de) um administrador.
// Uso: node scripts/create-admin.mjs "email@botanika.com" "senha" "Nome"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const [, , email, password, name] = process.argv;

if (!email || !password) {
  console.error(
    'Uso: node scripts/create-admin.mjs "email@botanika.com" "senha" "Nome"',
  );
  process.exit(1);
}

const prisma = new PrismaClient();

const passwordHash = await bcrypt.hash(password, 10);

const admin = await prisma.admin.upsert({
  where: { email: email.toLowerCase() },
  update: { passwordHash, name: name || "Admin" },
  create: { email: email.toLowerCase(), passwordHash, name: name || "Admin" },
});

console.log(`✓ Admin pronto: ${admin.email}`);
await prisma.$disconnect();
