"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sugerirRotasUT = void 0;
const prisma_1 = require("../lib/prisma");
const geolib_1 = require("geolib");
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
                }
            },
        });
        const candidatas = [];
        cidadesSemFabrica.forEach((c) => {
            const d = (0, geolib_1.getDistanceFromLine)({ latitude: c.latitude, longitude: c.longitude }, { latitude: cidadeX.latitude, longitude: cidadeX.longitude }, { latitude: cidadeY.latitude, longitude: cidadeY.longitude });
            if (d <= 200_000) {
                candidatas.push({ ...c, distancia: d });
            }
        });
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
//# sourceMappingURL=rotaSugestaoControllerOriginal.js.map