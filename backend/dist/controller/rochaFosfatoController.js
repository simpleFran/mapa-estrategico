"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RochaFosfatoController = void 0;
const prisma_1 = require("../lib/prisma");
class RochaFosfatoController {
    static async getCidades(req, res) {
        try {
            const rochaFosfato = await prisma_1.prisma.rochaFosfato.findMany({
                include: {
                    municipio: {
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
                    },
                },
            });
            const resultado = rochaFosfato.map((item) => ({
                codigo_ibge: item.municipio.codigo_ibge,
                nome: item.municipio.nome,
                latitude: item.municipio.latitude,
                longitude: item.municipio.longitude,
                estado: item.municipio.estado.uf,
            }));
            res.json(resultado);
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ message: "Erro ao buscar cidades com rocha fosfato." });
        }
    }
}
exports.RochaFosfatoController = RochaFosfatoController;
//# sourceMappingURL=rochaFosfatoController.js.map