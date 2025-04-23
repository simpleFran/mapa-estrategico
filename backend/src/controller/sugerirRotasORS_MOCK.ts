import { Request, Response } from "express";

// Mock de municípios
const mockMunicipios = [
  {
    codigo_ibge: 1001,
    nome: "Cidade A",
    latitude: -23.5,
    longitude: -46.6,
    estado: { uf: "SP" },
  },
  {
    codigo_ibge: 1002,
    nome: "Cidade B",
    latitude: -22.9,
    longitude: -43.2,
    estado: { uf: "RJ" },
  },
  {
    codigo_ibge: 1003,
    nome: "Cidade C",
    latitude: -20.3,
    longitude: -40.3,
    estado: { uf: "ES" },
  },
  {
    codigo_ibge: 1004,
    nome: "Cidade D",
    latitude: -19.9,
    longitude: -44.0,
    estado: { uf: "MG" },
  },
  {
    codigo_ibge: 1005,
    nome: "Cidade E",
    latitude: -25.4,
    longitude: -49.3,
    estado: { uf: "PR" },
  },
];

// Mock de cidades sem fábrica
const mockSemFabrica = mockMunicipios.slice(2); // Cidade C, D e E

export const sugerirRotasORS_MOCK = async (req: Request, res: Response) => {
  const cidadeX = mockMunicipios[0]; // Cidade A
  const cidadeY = mockMunicipios[1]; // Cidade B

  // Mock de coordenadas intermediárias da rota
  const coordenadas = [
    [cidadeX.longitude, cidadeX.latitude],
    [-23.0, -45.0],
    [cidadeY.longitude, cidadeY.latitude],
  ];

  const pontoMedioIndex = Math.floor(coordenadas.length / 2);
  const [long, lat] = coordenadas[pontoMedioIndex];
  const pontoMedio = { latitude: lat, longitude: long };

  // Mocka cálculo de distância aleatória para cada cidade sem fábrica
  const sugestoes = mockSemFabrica.map((cidade) => {
    const distancia = Math.floor(Math.random() * 200_000); // até 200 km
    return { ...cidade, distancia };
  });

  const melhores = sugestoes
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, 3);

  res.json({
    origem: cidadeX,
    destino: cidadeY,
    distanciaTotal: 315000,
    duration: 14400,
    pontoMedio,
    sugestoes: melhores,
  });
};
