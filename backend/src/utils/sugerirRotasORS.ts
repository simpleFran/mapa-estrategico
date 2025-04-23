import axios from "axios";

/**
 * Sugere uma rota entre duas cidades usando a API da OpenRouteService.
 * @param cidadeXCoords Coordenadas [longitude, latitude] da cidade de origem.
 * @param cidadeYCoords Coordenadas [longitude, latitude] da cidade de destino.
 * @returns Objeto contendo distância, duração e passos da rota.
 */
export async function sugerirRotasORS(
  cidadeXCoords: [number, number],
  cidadeYCoords: [number, number]
){
  try {
    const rotaORS = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        coordinates: [cidadeXCoords, cidadeYCoords],
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("URL:", rotaORS.config.url); // debug opcional
    console.log("Resposta ORS:", JSON.stringify(rotaORS.data, null, 2)); // debug opcional

    const data = rotaORS.data;

    if (!data || !Array.isArray(data.routes) || data.routes.length === 0) {
      throw new Error("Resposta da ORS não contém rotas válidas.");
    }

    const rota = data.routes[0];

    if (
      !rota.summary ||
      typeof rota.summary.distance !== "number" ||
      typeof rota.summary.duration !== "number"
    ) {
      throw new Error("Resumo da rota inválido.");
    }

    const segmento = rota.segments?.[0];

    if (!segmento || !Array.isArray(segmento.steps)) {
      throw new Error("Etapas da rota não encontradas.");
    }

    return {
      distancia: rota.summary.distance,
      duracao: rota.summary.duration,
      passos: segmento.steps,
    };
  } catch (erro: any) {
    console.error("Erro no ORS:", erro.message || erro);
    throw new Error("Erro ao consultar rota via ORS");
  }
}
