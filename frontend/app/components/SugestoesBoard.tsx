"use client";

interface Sugestion {
  nome: string;
  estado: { uf: string };
  pib: number | null;
  populacao: number | null;
  distancia: number; // vem em km
}

export default function SugestionsBoard({
  sugestions,
}: {
  sugestions: Sugestion[];
}) {
  if (!sugestions || sugestions.length === 0) return null;

  return (
    <div
      className="mt-4 p-4 rounded-lg shadow-md"
      style={{ backgroundColor: "#53943e", color: "white" }}
    >
      <h3 className="text-lg font-bold mb-2">Sugestões de Municípios</h3>

      {sugestions.map((city, idx) => {
        const pibFormatado =
          city.pib != null
            ? city.pib.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 2,
              })
            : "Não informado";

        const populacaoFormatada =
          city.populacao != null
            ? city.populacao.toLocaleString("pt-BR",{
              maximumFractionDigits: 2,
            })
            : "Não informada";

        const distanciaFormatada =
          city.distancia != null
            ? (city.distancia / 1000).toLocaleString("pt-BR",{maximumFractionDigits: 2,})
            : "–";

        return (
          <div key={idx} className="border-t border-white/40 py-2">
            <p className="font-semibold">
              {city.nome} - {city.estado?.uf ?? "??"}
            </p>

            <p>
              PIB: {pibFormatado} <span className="text-xs">(x 1.000)</span>
            </p>

            <p>População: {populacaoFormatada}</p>

            <p>Distância: {distanciaFormatada  } km</p>
          </div>
        );
      })}
    </div>
  );
}
