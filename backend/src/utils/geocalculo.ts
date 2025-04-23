import { getDistanceFromLine } from "geolib";

/**
 * Calcula a distância entre um ponto (cidade) e o segmento entre origem e destino
 */
export function distanciaParaSegmento(
  ponto: any,
  origem: any,
  destino: any
): number {
  return getDistanceFromLine(ponto, origem, destino);
}
