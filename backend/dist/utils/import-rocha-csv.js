"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const rochaFile = path_1.default.join(__dirname, "../../data/rocha-fosfato.csv");
async function importCamaAviaria() {
    const rochas = [];
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(rochaFile)
            .pipe((0, csv_parser_1.default)({ separator: "," }))
            .on("data", (row) => {
            const municipioId = parseInt(String(row.municipioId).trim());
            if (isNaN(municipioId)) {
                console.warn("⚠️ municipioId inválido:", row);
                return;
            }
            rochas.push({ municipioId });
        })
            .on("end", async () => {
            try {
                for (const rocha of rochas) {
                    const municipio = await prisma.municipio.findUnique({
                        where: { codigo_ibge: rocha.municipioId },
                    });
                    if (municipio) {
                        await prisma.rochaFosfato.upsert({
                            where: {
                                municipioId: rocha.municipioId,
                            },
                            update: {},
                            create: {
                                municipioId: rocha.municipioId,
                            },
                        });
                    }
                    else {
                        console.warn("❌ Município não encontrado no banco:", rocha.municipioId);
                    }
                }
                console.log(`✅ Rochas de Fosfatos importadas: ${rochas.length}`);
                resolve();
            }
            catch (error) {
                console.error("Erro ao importar rochaas:", error);
                reject(error);
            }
        });
    });
}
async function main() {
    console.log("🚀 Iniciando importação...");
    await importCamaAviaria();
    await prisma.$disconnect();
    console.log("🎉 Importação concluída com sucesso!");
}
main().catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=import-rocha-csv.js.map