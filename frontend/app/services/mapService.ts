/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = "http://localhost:8081/api"; // URL base da AP


export async function fetchCamaAviaria() {
  const res = await fetch(`${BASE_URL}/cama-aviaria`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export async function fetchRochaFosfato() {
  const res = await fetch(`${BASE_URL}/rocha-fosfato`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export async function fetchEmpresasFertilizantes() {
  const res = await fetch(`${BASE_URL}/empresas-fertilizantes`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export async function fetchSugestoes(origemId: number, destinoId: number) {
  try {
    const res = await fetch(
      `${BASE_URL}/sugestao-ors?cidadeXId=${origemId}&cidadeYId=${destinoId}`,
      {
        headers:{
          Authorization: `Bearer theWinterIsComing_Map`,
        }
      }
    );
    if (!res.ok) throw new Error("Erro ao buscar sugestões");
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    return [];
  }
}


export async function fetchCidadesOrigemDestino() {
  const [cama, rocha] = await Promise.all([
    fetchCamaAviaria(),
    fetchRochaFosfato(),
  ]);

  const cidadesSet = new Map<string, any>();

  cama.forEach((item: any) => {
    const key = `${item.latitude}-${item.longitude}`;
    cidadesSet.set(key, {
      nome: item.nome,
      latitude: item.latitude,
      longitude: item.longitude,
      uf: item.estado || item.uf,
      codigo_ibge: item.codigo_ibge ?? null,
    });
  });

  rocha.forEach((item: any) => {
    const key = `${item.latitude}-${item.longitude}`;
    if (!cidadesSet.has(key)) {
      cidadesSet.set(key, {
        nome: item.nome,
        latitude: item.latitude,
        longitude: item.longitude,
        uf: item.estado || item.uf,
        codigo_ibge: item.codigo_ibge ?? null,
      });
    }
  });

  return Array.from(cidadesSet.values());
}
