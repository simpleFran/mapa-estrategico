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
  distancia: number;
};

export const getTop10CidadesCandidatas = async (
  cidadeX: Municipio,
  cidadeY: Municipio
): Promise<Candidata[]> => {
  // 1. Calcular o ponto médio entre cidadeX e cidadeY
  const pontoMedio = {
    latitude: (cidadeX.latitude + cidadeY.latitude) / 2,
    longitude: (cidadeX.longitude + cidadeY.longitude) / 2,
  };

  // 2. Buscar cidades válidas com todos os filtros de domínio
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

  // 3. Calcular distância até o ponto médio
  const candidatas = cidadesFiltradas.map((cidade) => {
    const distancia = getDistance(
      { latitude: cidade.latitude, longitude: cidade.longitude },
      pontoMedio
    );
    return { ...cidade, distancia };
  });

  // 4. Ordenar por distância crescente e pegar as 10 mais próximas
  const top10 = candidatas
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, 10);

  return top10;
};
