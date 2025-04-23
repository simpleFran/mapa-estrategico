import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.estado.findMany();
    console.log("✅ Conexão com banco bem-sucedida.");
  } catch (err) {
    console.error("❌ Erro ao conectar com o banco:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
