"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
async function importarEstados() {
    const filePath = path_1.default.resolve(__dirname, "estados.csv");
    const parser = fs_1.default
        .createReadStream(filePath)
        .pipe((0, csv_parser_1.default)({ delimiter: ",", fromLine: 2 }));
    for await (const row of parser) {
        const [codigo_uf, uf, nome, latitude, longitude, regiao] = row;
        const estado = {
            codigo_uf,
            uf,
            nome,
            latitude,
            longitude,
            regiao,
        };
        console.log("🧾 Importando estado:", estado);
        await prisma.estado.create({
            data: {
                id: parseInt(estado.codigo_uf),
                sigla: estado.uf,
                nome: estado.nome,
                latitude: parseFloat(estado.latitude),
                longitude: parseFloat(estado.longitude),
                regiao: estado.regiao,
            },
        });
    }
    console.log("✅ Importação de estados finalizada com sucesso.");
}
importarEstados()
    .catch((e) => {
    console.error("❌ Erro na importação:", e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=importEstados.js.map