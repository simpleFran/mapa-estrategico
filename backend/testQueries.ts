import { getDistance } from "geolib";
import { prisma } from "./src/lib/prisma";

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

async function main() {
  // Coordenadas de Vicentinópolis - GO e Registro - SP
  const cidadeX = {
    codigo_ibge: 5222054,
    latitude: -17.93001,
    longitude: -49.49471,
  };

  const cidadeY = {
    codigo_ibge: 3542602,
    latitude: -24.35677,
    longitude: -47.6844,
  };

  // Calcular o ponto médio entre cidadeX e cidadeY
  const pontoMedio = {
    latitude: (cidadeX.latitude + cidadeY.latitude) / 2,
    longitude: (cidadeX.longitude + cidadeY.longitude) / 2,
  };
  console.log("Ponto médio calculado:", pontoMedio);

  // Buscar cidades válidas com todos os filtros de domínio
  const cidadesFiltradas = await prisma.municipio.findMany({
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

  console.log(`Total de cidades filtradas: ${cidadesFiltradas.length}`);

  // Calcular distância até o ponto médio
  const candidatas = cidadesFiltradas.map((cidade) => {
    const distancia = getDistance(
      { latitude: cidade.latitude, longitude: cidade.longitude },
      pontoMedio
    );
    return { ...cidade, distancia };
  });

  // Ordenar por distância crescente e pegar as 10 mais próximas
  const top10 = candidatas
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, 10);

  console.log("Top 10 cidades candidatas:");
  console.table(top10);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
