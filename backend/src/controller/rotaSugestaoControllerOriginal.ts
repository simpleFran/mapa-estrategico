
import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { getDistanceFromLine } from "geolib";

export const sugerirRotasUT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { cidadeXId, cidadeYId } = req.query;

  try {
    // 1. Buscar dados das cidades X e Y
    const cidadeX = await prisma.municipio.findUnique({
      where: { codigo_ibge: Number(cidadeXId) },
    });
    const cidadeY = await prisma.municipio.findUnique({
      where: { codigo_ibge: Number(cidadeYId) },
    });

    if (!cidadeX || !cidadeY) {
      res.status(404).json({ error: "Cidades não encontradas." });
      return; // interrompe
    }

    // 2. Buscar cidades SEM fábrica de fertilizante
    const cidadesSemFabrica = await prisma.municipio.findMany({
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

    // 3. Filtrar por até 200km do segmento X→Y
    const candidatas: Array<{
      codigo_ibge: number;
      nome: string;
      latitude: number;
      longitude: number;
      distancia: number;
    }> = [];

    cidadesSemFabrica.forEach((c) => {
      const d = getDistanceFromLine(
        { latitude: c.latitude, longitude: c.longitude },
        { latitude: cidadeX.latitude, longitude: cidadeX.longitude },
        { latitude: cidadeY.latitude, longitude: cidadeY.longitude }
      );

      if (d <= 200_000) {
        candidatas.push({ ...c, distancia: d });
      }
    });

    // 4. Ordenar e limitar a 3
    const melhores = candidatas
      .sort((a, b) => a.distancia - b.distancia)
      .slice(0, 3);

    res.json({
      origem: cidadeX,
      destino: cidadeY,
      sugestoes: melhores,
    });
   
  } catch (err) {
    console.error("Erro ao sugerir rotas:", err);
    next(err);
  }
};
