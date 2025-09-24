"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sugerirRotasORS = sugerirRotasORS;
const axios_1 = __importDefault(require("axios"));
async function sugerirRotasORS(cidadeXCoords, cidadeYCoords) {
    try {
        const rotaORS = await axios_1.default.post("https://api.openrouteservice.org/v2/directions/driving-car", {
            coordinates: [cidadeXCoords, cidadeYCoords],
        }, {
            headers: {
                Authorization: process.env.ORS_API_KEY,
                "Content-Type": "application/json",
            },
        });
        console.log("URL:", rotaORS.config.url);
        console.log("Resposta ORS:", JSON.stringify(rotaORS.data, null, 2));
        const data = rotaORS.data;
        if (!data || !Array.isArray(data.routes) || data.routes.length === 0) {
            throw new Error("Resposta da ORS não contém rotas válidas.");
        }
        const rota = data.routes[0];
        if (!rota.summary ||
            typeof rota.summary.distance !== "number" ||
            typeof rota.summary.duration !== "number") {
            throw new Error("Resumo da rota inválido.");
        }
        const segmento = rota.segments?.[0];
        if (!segmento || !Array.isArray(segmento.steps)) {
            throw new Error("Etapas da rota não encontradas.");
        }
        return {
            distancia: rota.summary.distance,
            duracao: rota.summary.duration,
            passos: segmento.steps,
        };
    }
    catch (erro) {
        console.error("Erro no ORS:", erro.message || erro);
        throw new Error("Erro ao consultar rota via ORS");
    }
}
//# sourceMappingURL=sugerirRotasORS.js.map