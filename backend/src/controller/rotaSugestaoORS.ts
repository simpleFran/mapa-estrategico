import { Request, Response } from "express";
import { client } from "../libs/openRouteService";

export const getMainRoute = async (req: Request, res: Response) => {
  try {
    const { coordinates } = req.body;

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return res
        .status(400)
        .json({
          error: "Coordenadas inválidas. Envie pelo menos dois pontos.",
        });
    }

    const routeParams = {
      coordinates,
      instructions: true,
      format: "json",
    };

    const result = await client.directions(routeParams);

    const route = result.routes[0];

    console.debug("DEBUG rota principal:", JSON.stringify(route, null, 2));

    if (
      !route ||
      !route.segments ||
      !Array.isArray(route.segments) ||
      route.segments.length === 0 ||
      !route.segments[0].steps ||
      !Array.isArray(route.segments[0].steps) ||
      route.segments[0].steps.length === 0
    ) {
      console.error("Rota malformada:", JSON.stringify(route, null, 2));
      return res.status(500).json({ error: "Rota principal malformada" });
    }

    res.status(200).json({
      summary: route.summary,
      steps: route.segments[0].steps,
      geometry: route.geometry,
      bbox: route.bbox,
    });
  } catch (error: any) {
    console.error("Erro ao buscar rota principal:", error.message || error);
    res.status(500).json({ error: "Erro ao buscar rota principal" });
  }
};
