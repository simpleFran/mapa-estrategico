"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop10CidadesCandidatas = void 0;
const geolib_1 = require("geolib");
const prisma_1 = require("../lib/prisma");
const getTop10CidadesCandidatas = async (cidadeX, cidadeY) => {
    const pontoMedio = {
        latitude: (cidadeX.latitude + cidadeY.latitude) / 2,
        longitude: (cidadeX.longitude + cidadeY.longitude) / 2,
    };
    const cidadesFiltradas = await prisma_1.prisma.municipio.findMany({
        where: {
            AND: [
                { codigo_ibge: { notIn: [cidadeX.codigo_ibge, cidadeY.codigo_ibge] } },
                { empresasFertilizante: { none: {} } },
                { camaAviaria: { is: null } },
                { rochaFosfato: { is: null } },
            ],
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
    const candidatas = cidadesFiltradas.map((cidade) => {
        const distancia = (0, geolib_1.getDistance)({ latitude: cidade.latitude, longitude: cidade.longitude }, pontoMedio);
        return { ...cidade, distancia };
    });
    const top10 = candidatas
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 10);
    return top10;
};
exports.getTop10CidadesCandidatas = getTop10CidadesCandidatas;
//# sourceMappingURL=getTop10CidadesCandidatas.js.map