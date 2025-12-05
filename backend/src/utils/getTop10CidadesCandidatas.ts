import { getDistance } from "geolib";
import { Municipio } from "@prisma/client";
import { prisma } from "../lib/prisma";

export type Candidata = {
  codigo_ibge: number;
  nome: string;
  latitude: number;
  longitude: number;
  pib: number | null;
  populacao: number | null;
  estado: {
    uf: string;
  };
  distancia: number;
};

export const getTop10CidadesCandidatas = async (
  cidadeX: Municipio,
  cidadeY: Municipio,
  distanciaMaxima: number = 200_000
): Promise<Candidata[]> => {
  const pontoMedio = {
    latitude: (cidadeX.latitude + cidadeY.latitude) / 2,
    longitude: (cidadeX.longitude + cidadeY.longitude) / 2,
  };

  // Buscar cidades válidas
  const cidadesFiltradas = await prisma.municipio.findMany({
    where: {
      AND: [
        { codigo_ibge: { notIn: [cidadeX.codigo_ibge, cidadeY.codigo_ibge] } },
        { empresasFertilizante: { none: {} } },
        { camaAviaria: null },
        { rochaFosfato: null },
      ],
    },
    orderBy: {
      pib: "desc",
    },
    select: {
      codigo_ibge: true,
      nome: true,
      latitude: true,
      longitude: true,
      pib: true,
      populacao: true,
      estado: {
        select: {
          uf: true,
        },
      },

    
      
    },
  });

  // Calcular distância e garantir tipos corretos
  const candidatas: Candidata[] = cidadesFiltradas
    .map((cidade) => ({
      codigo_ibge: cidade.codigo_ibge,
      nome: cidade.nome,
      latitude: cidade.latitude,
      longitude: cidade.longitude,
      pib: cidade.pib !== null ? Number(cidade.pib) : null,
      populacao: cidade.populacao !== null ? Number(cidade.populacao) : null,
      estado: cidade.estado,
      distancia: getDistance(
        { latitude: cidade.latitude, longitude: cidade.longitude },
        pontoMedio
      ),
    }))
    .filter((cidade) => cidade.distancia <= distanciaMaxima)
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, 10);

  return candidatas;
};
