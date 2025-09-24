"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sugerirRotasORS = exports.sugerirRotasUT = void 0;
const prisma_1 = require("../lib/prisma");
const geolib_1 = require("geolib");
const axios_1 = __importDefault(require("axios"));
const polyline_1 = __importDefault(require("polyline"));
const env_1 = require("../env");
const getTop10CidadesCandidatas_1 = require("../utils/getTop10CidadesCandidatas");
const sugerirRotasUT = async (req, res, next) => {
    const { cidadeXId, cidadeYId } = req.query;
    try {
        const cidadeX = await prisma_1.prisma.municipio.findUnique({
            where: { codigo_ibge: Number(cidadeXId) },
        });
        const cidadeY = await prisma_1.prisma.municipio.findUnique({
            where: { codigo_ibge: Number(cidadeYId) },
        });
        if (!cidadeX || !cidadeY) {
            res.status(404).json({ error: "Cidades não encontradas." });
            return;
        }
        const pontoMedio = {
            latitude: (cidadeX.latitude + cidadeY.latitude) / 2,
            longitude: (cidadeX.longitude + cidadeY.longitude) / 2,
        };
        const cidadesSemFabrica = await prisma_1.prisma.municipio.findMany({
            where: {
                empresasFertilizante: { none: {} },
            },
            select: {
                codigo_ibge: true,
                nome: true,
                latitude: true,
                longitude: true,
                estado: {
                    select: {
                        uf: true,
                    },
                },
            },
        });
        const candidatas = cidadesSemFabrica
            .filter((c) => c.codigo_ibge !== cidadeX.codigo_ibge &&
            c.codigo_ibge !== cidadeY.codigo_ibge)
            .map((c) => {
            const distancia = (0, geolib_1.getDistance)({ latitude: c.latitude, longitude: c.longitude }, pontoMedio);
            return { ...c, distancia };
        })
            .filter((c) => c.distancia <= 200_000);
        const melhores = candidatas
            .sort((a, b) => a.distancia - b.distancia)
            .slice(0, 3);
        res.json({
            origem: cidadeX,
            destino: cidadeY,
            sugestoes: melhores,
        });
    }
    catch (err) {
        console.error("Erro ao sugerir rotas:", err);
        next(err);
    }
};
exports.sugerirRotasUT = sugerirRotasUT;
const sugerirRotasORS = async (req, res) => {
    const { cidadeXId, cidadeYId } = req.query;
    console.log("Coordenadas da cidadeX:", cidadeXId);
    console.log("Coordenadas da cidadeY:", cidadeYId);
    try {
        const cidadeX = await prisma_1.prisma.municipio.findUnique({
            where: { codigo_ibge: Number(cidadeXId) },
        });
        const cidadeY = await prisma_1.prisma.municipio.findUnique({
            where: { codigo_ibge: Number(cidadeYId) },
        });
        if (!cidadeX || !cidadeY) {
            res.status(404).json({ error: "Cidades não encontradas." });
            return;
        }
        const rotaORS = await axios_1.default.post("https://api.openrouteservice.org/v2/directions/driving-car", {
            coordinates: [
                [cidadeX.longitude, cidadeX.latitude],
                [cidadeY.longitude, cidadeY.latitude],
            ],
        }, {
            headers: {
                Authorization: env_1.env.ORS_API_KEY,
                "Content-Type": "application/json",
            },
        });
        const rota = rotaORS.data;
        if (!rota.routes ||
            !Array.isArray(rota.routes) ||
            rota.routes.length === 0) {
            console.error("Resposta inesperada do ORS:", rota);
            res.status(500).json({ error: "Resposta inesperada da API do ORS" });
            return;
        }
        const route = rota.routes[0];
        console.log("DEBUG rota principal:", JSON.stringify(route, null, 2));
        if (!route || !route.geometry) {
            console.error("Rota malformada:", JSON.stringify(route, null, 2));
            res.status(500).json({ error: "Rota principal malformada." });
            return;
        }
        const distanciaTotal = route.summary?.distance ?? 0;
        const duration = route.summary?.duration ?? 0;
        const coordenadas = polyline_1.default.decode(route.geometry);
        console.log("Coordenadas decodificadas:", coordenadas);
        if (coordenadas.length === 0) {
            console.error("Coordenadas vazias na rota principal.");
            res.status(500).json({ error: "Sem coordenadas na rota principal." });
            return;
        }
        const pontoMedioIndex = Math.floor(coordenadas.length / 2);
        if (pontoMedioIndex >= coordenadas.length) {
            console.error("Índice do ponto médio fora dos limites.");
            res.status(500).json({ error: "Erro ao calcular ponto médio." });
            return;
        }
        const [lat, long] = coordenadas[pontoMedioIndex];
        const pontoMedio = { latitude: lat, longitude: long };
        console.log("Ponto médio calculado:", pontoMedio);
        const cidadesCandidatas = await (0, getTop10CidadesCandidatas_1.getTop10CidadesCandidatas)(cidadeX, cidadeY);
        console.time("tempoTotalRotas");
        const rotasPromessas = cidadesCandidatas.map(async (cidade) => {
            try {
                const rotaSugestao = await axios_1.default.post("https://api.openrouteservice.org/v2/directions/driving-car", {
                    coordinates: [
                        [pontoMedio.longitude, pontoMedio.latitude],
                        [cidade.longitude, cidade.latitude],
                    ],
                }, {
                    headers: {
                        Authorization: env_1.env.ORS_API_KEY,
                        "Content-Type": "application/json",
                    },
                });
                const rotaData = rotaSugestao.data;
                if (rotaData.routes &&
                    Array.isArray(rotaData.routes) &&
                    rotaData.routes.length > 0) {
                    const distancia = rotaData.routes[0].summary.distance;
                    if (distancia <= 200_000) {
                        return { ...cidade, distancia };
                    }
                }
                else {
                    console.warn(`Sem rota viável até ${cidade.nome} - ignorando`);
                }
            }
            catch (err) {
                console.warn(`Erro ao calcular distância até ${cidade.nome} - ignorando`);
            }
            return null;
        });
        const rotasCalculadas = await Promise.all(rotasPromessas);
        console.timeEnd("tempoTotalRotas");
        const sugestoes = rotasCalculadas.filter((cidade) => cidade !== null);
        const melhores = sugestoes
            .sort((a, b) => a.distancia - b.distancia)
            .slice(0, 3);
        res.json({
            origem: cidadeX,
            destino: cidadeY,
            distanciaTotal,
            duration,
            pontoMedio,
            sugestoes: melhores,
            rotasCoordenadas: coordenadas
        });
    }
    catch (error) {
        console.error("Erro no ORS:", error.response?.data || error.message);
        res.status(500).json({ error: "Erro ao consultar rota via ORS" });
        return;
    }
};
exports.sugerirRotasORS = sugerirRotasORS;
//# sourceMappingURL=rotaSugestaoControllerUT.js.map