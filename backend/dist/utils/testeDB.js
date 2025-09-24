"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function test() {
    try {
        await prisma.estado.findMany();
        console.log("✅ Conexão com banco bem-sucedida.");
    }
    catch (err) {
        console.error("❌ Erro ao conectar com o banco:", err);
    }
    finally {
        await prisma.$disconnect();
    }
}
test();
//# sourceMappingURL=testeDB.js.map