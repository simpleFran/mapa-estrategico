"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const estadosFile = path_1.default.join(__dirname, "../../data/estados.csv");
fs_1.default.createReadStream(estadosFile)
    .pipe((0, csv_parser_1.default)({
    separator: ",",
    skipLines: 1,
    headers: ["codigo_uf", "uf", "nome", "latitude", "longitude", "regiao"],
}))
    .on("data", (row) => {
    console.log("🧾 Linha CSV:", row);
})
    .on("end", () => {
    console.log("✅ Leitura finalizada com sucesso.");
});
//# sourceMappingURL=testCSVEstados.js.map