"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresasFertilizanteController = void 0;
const prisma_1 = require("../lib/prisma");
class EmpresasFertilizanteController {
    static async getCidades(req, res) {
        try {
            const empresas = await prisma_1.prisma.empresaFertilizante.findMany({
                include: {
                    municipio: {
                        select: {
                            codigo_ibge: true,
                            nome: true,
                            latitude: true,
                            longitude: true,
                            estado: {
                                select: {
                                    uf: true
                                }
                            }
                        }
                    },
                },
            });
            const resultado = empresas.map((empresa) => ({
                id: empresa.id,
                nome: empresa.nome,
                cidade: empresa.municipio.nome,
                latitude: empresa.municipio.latitude,
                longitude: empresa.municipio.longitude,
                uf: empresa.municipio.estado.uf,
            }));
            res.json(resultado);
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ message: "Erro ao buscar cidades com Empresa de Fertilizantes." });
        }
    }
}
exports.EmpresasFertilizanteController = EmpresasFertilizanteController;
//# sourceMappingURL=empresasFertilizanteController.js.map