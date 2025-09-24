import { getDistance } from "geolib";
import { Municipio } from "@prisma/client";
import { prisma } from "../lib/prisma";

type Candidata = {
  codigo_ibge: number;
  nome: string;
  latitude: number;
  longitude: number;
  estado: {
    uf: string;
  };
  distancia: number; //Distancia ate o ponto médio
};

export const getTop10CidadesCandidatas = async (
  cidadeX: Municipio,
  cidadeY: Municipio,
  distanciaMaxima: number = 200_000 // Padrão: 200 km (está em metros)
): Promise<Candidata[]> => {
  // 1. Calcular o ponto médio entre cidadeX e cidadeY
  const pontoMedio = {
    latitude: (cidadeX.latitude + cidadeY.latitude) / 2,
    longitude: (cidadeX.longitude + cidadeY.longitude) / 2,
  };

  // 2. Buscar cidades válidas com todos os filtros 
  const cidadesFiltradas = await prisma.municipio.findMany({
    where: {
      AND: [
        { codigo_ibge: { notIn: [cidadeX.codigo_ibge, cidadeY.codigo_ibge] } },
        { empresasFertilizante: { none: {} } },
        { camaAviaria: { none: {} } },
        { rochaFosfato: { none: {} } },
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

  // 3. Calcular distância até o ponto médio e filtar por distancia maxima
  const candidatas = cidadesFiltradas
    .map((cidade) => {
      const distancia = getDistance(
        { latitude: cidade.latitude, longitude: cidade.longitude },
        pontoMedio
      );
      return { ...cidade, distancia };
    })
    .filter((cidade) => cidade.distancia <= distanciaMaxima); // Filtrar por distância máxima

  // 4. Ordenar por distância crescente e pegar as 10 mais próximas
  const top10 = candidatas
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, 10);

  return top10;
};
