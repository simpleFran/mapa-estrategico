import { readFileSync, writeFileSync } from "fs";

// Lê o arquivo JSON original
const rawData = readFileSync("test-city-now.json", "utf-8");
const data = JSON.parse(rawData);

// Função para corrigir latitude/longitude se estiverem erradas
function fixCoordinate(coord: any) {
  // Se o número for maior ou menor do que esperado (-90 a 90 latitude, -180 a 180 longitude)
  if (coord > 90 || coord < -90) {
    // Adiciona a vírgula na posição correta
    // Ex: -60552 -> -60.552
    const coordStr = coord.toString();
    const isNegative = coordStr.startsWith("-");
    const absoluteCoord = isNegative ? coordStr.slice(1) : coordStr;
    const fixed =
      absoluteCoord.length > 4
        ? absoluteCoord.slice(0, absoluteCoord.length - 4) +
          "." +
          absoluteCoord.slice(absoluteCoord.length - 4)
        : "0." + absoluteCoord;

    return parseFloat((isNegative ? "-" : "") + fixed);
  }

  // Se já estiver ok, retorna como está
  return coord;
}

// Percorre e corrige cada município
const fixedMunicipios = data.Municipio.map((municipio: any) => {
  return {
    ...municipio,
    latitude: fixCoordinate(municipio.latitude),
    longitude: fixCoordinate(municipio.longitude),
  };
});

// Escreve o novo arquivo JSON
writeFileSync(
  "data-output.json",
  JSON.stringify({ Municipio: fixedMunicipios }, null, 2)
);

console.log("Arquivo corrigido gerado com sucesso: data-output.json");
