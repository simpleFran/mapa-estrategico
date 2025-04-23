// src/controllers/RochaFosfatoController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class EmpresasFertilizanteController {
  static async getCidades(req: Request, res: Response) {
    try {
      const empresas = await prisma.empresaFertilizante.findMany({
        include: {
          municipio: {
            select:{
              codigo_ibge: true,
              nome: true,
              latitude: true,
              longitude: true,
              estado:{
                select:{
                  uf:true
                }
              }
            }
          },
        },
      });

      const resultado = empresas.map((empresa) => ({
        id: empresa.id,
        nome: empresa.nome,
        cidade:empresa.municipio.nome,
        latitude: empresa.municipio.latitude,
        longitude: empresa.municipio.longitude,
        uf: empresa.municipio.estado.uf,
      }));

       res.json(resultado);
    } catch (error) {
      console.error(error);
       res
        .status(500)
        .json({ message: "Erro ao buscar cidades com Empresa de Fertilizantes." });
    }
  }
}
