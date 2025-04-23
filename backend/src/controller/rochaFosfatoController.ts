// src/controllers/RochaFosfatoController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class RochaFosfatoController {
  static async getCidades(req: Request, res: Response) {
    try {
    //   const cidades = await prisma.rochaFosfato.findMany({
    //     include: {
    //       municipio: true,
    //         // Include the 'estado' relation if needed
    //         estado:{
    //             select:{
    //                 uf:true
    //             }
    //         }
    //     },
    //   });
 const rochaFosfato = await prisma.rochaFosfato.findMany({
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
    } catch (error) {
      console.error(error);
       res
        .status(500)
        .json({ message: "Erro ao buscar cidades com rocha fosfato." });
    }
  }
}
