/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import {
  fetchCamaAviaria,
  fetchRochaFosfato,
  fetchEmpresasFertilizantes,
  fetchSugestoes,
  fetchCidadesOrigemDestino,
} from "../services/mapService";
import CitySelectCamaAviaria from "./CitySelectCamaAviaria";
import CitySelectRochaFosfato from "./CitySelectRochaFosfato";

import Legend from "./Legend";
import toast from "react-hot-toast";
import DistanceSelector from "./DistanceSelector";
import SugestionsBoard from "./SugestoesBoard";

// Ícones personalizados
const camaAviariaIcon = new Icon({
  iconUrl: "/icons/cama-aviaria-icon.png",
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

const rochaFosfatoIcon = new Icon({
  iconUrl: "/icons/rocha-fosfato-icon.png",
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

const fertilizantesIcon = new Icon({
  iconUrl: "/icons/fertilizante-icon.png",
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

const sugestaoIcon = new Icon({
  iconUrl: "/icons/sugestao-icon.png",
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

export default function Map() {
  const [camaAviaria, setCamaAviaria] = useState<any[]>([]);
  const [rochaFosfato, setRochaFosfato] = useState<any[]>([]);
  const [fertilizantes, setFertilizantes] = useState<any[]>([]);
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [rotaCoordenadas, setRotaCoordenadas] = useState<any[]>([]); // Novo estado para as coordenadas da rota
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cidadesOrigemDestino, setCidadesOrigemDestino] = useState<any[]>([]);
  const [cidadeCamaAviaria, setCidadeCamaAviaria] = useState<any | null>(null);
  const [cidadeRochaFosfato, setCidadeRochaFosfato] = useState<any | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(200); // Valor inicial: 200 km

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [markersLoading, setMarkersLoading] = useState(true);

  useEffect(() => {
    async function carregarCamadas() {
      try {
        setMarkersLoading(true);

        const [cama, rocha, ferts] = await Promise.all([
          fetchCamaAviaria(),
          fetchRochaFosfato(),
          fetchEmpresasFertilizantes(),
        ]);

        setCamaAviaria(cama);
        setRochaFosfato(rocha);

        const agrupadas = ferts.reduce((acc: any, item: any) => {
          const key = `${item.latitude}-${item.longitude}`;
          if (!acc[key]) {
            acc[key] = {
              cidade: item.cidade,
              uf: item.uf,
              latitude: item.latitude,
              longitude: item.longitude,
              empresas: [],
            };
          }
          acc[key].empresas.push(item.nome);
          return acc;
        }, {});
        setFertilizantes(Object.values(agrupadas));

        // se você ainda precisar disso:
        const cidades = await fetchCidadesOrigemDestino();
        setCidadesOrigemDestino(cidades);
      } catch (err) {
        console.error("Erro ao carregar camadas do mapa:", err);
        toast.error("Erro ao carregar dados iniciais do mapa.");
      } finally {
        setMarkersLoading(false);
      }
    }

    void carregarCamadas();
  }, []);


  useEffect(() => {
    console.log("mudou o max distance para", maxDistance);
    if (cidadeCamaAviaria?.codigo_ibge && cidadeRochaFosfato?.codigo_ibge) {
      setLoading(true);
      setError(null);
      fetchSugestoes(
        cidadeCamaAviaria.codigo_ibge,
        cidadeRochaFosfato.codigo_ibge,
        maxDistance * 1000 //Converte Km para metros
      )
        .then((res) => {
          // console.log("- Resposta do backend:", res); // Log para depuração
          setSugestoes(res.sugestoes);
          setRotaCoordenadas(res.rotasCoordenadas); // Atualiza as coordenadas da rota
        })
        .catch((err) => {
          console.error("Erro ao buscar sugestões:", err);
          setError("Ocorreu um erro ao calcular a rota.");
        })
        .finally(() => setLoading(false));
    }
  }, [cidadeCamaAviaria, cidadeRochaFosfato, maxDistance]);

  useEffect(() => {
    if (cidadeCamaAviaria && cidadeRochaFosfato) {
      const timeout = setTimeout(() => {
        setCidadeCamaAviaria(null);
        setCidadeRochaFosfato(null);
        toast.success(
          "Seleções resetadas automaticamente para novas escolhas."
        );
      }, 10000); // 10 segundos após a seleção

      return () => clearTimeout(timeout); // Limpa o timeout se o componente for desmontado
    }
  }, [cidadeCamaAviaria, cidadeRochaFosfato]);

  const handleMarkerDoubleClickUT = (cidade: any) => {
    if (isCamaAviaria(cidade)) {
      if (
        cidadeCamaAviaria &&
        cidade.codigo_ibge === cidadeCamaAviaria.codigo_ibge
      ) {
        toast.custom("Você já escolheu esta cidade como Cama Aviária.");
        return;
      }
      setCidadeCamaAviaria(cidade);
      toast.success(
        `${cidade.nome} - ${cidade.estado} definida como Cama Aviária.`
      );
      return;
    }

    if (isRochaFosfato(cidade)) {
      if (
        cidadeRochaFosfato &&
        cidade.codigo_ibge === cidadeRochaFosfato.codigo_ibge
      ) {
        toast.custom("Você já escolheu esta cidade como Rocha Fosfato.");
        return;
      }
      setCidadeRochaFosfato(cidade);
      toast.success(
        `${cidade.nome} - ${cidade.estado} definida como Rocha Fosfato.`
      );
      return;
    }
  };

  //funcao auxiliar - verifica se cidade é do tipo Cama Aviaria
  const isCamaAviaria = (cidade: any) => {
    return camaAviaria.some((item) => item.codigo_ibge === cidade.codigo_ibge);
  };
  //funcao auxiliar - verifica se cidade é do tipo Rocha Fosfato
  const isRochaFosfato = (cidade: any) => {
    return rochaFosfato.some((item) => item.codigo_ibge === cidade.codigo_ibge);
  };

  return (
    <>
      <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded shadow-md">
        <label className="block mb-2 font-bold">Cidades | Cama Aviária:</label>
        <CitySelectCamaAviaria onChange={setCidadeCamaAviaria} />

        <label className="block mb-2 font-bold">
          Cidades | Rocha de Fosfato:
        </label>
        <CitySelectRochaFosfato onChange={setCidadeRochaFosfato} />

        <div className="mt-4">
          <DistanceSelector
            initialDistance={maxDistance}
            onDistanceChange={setMaxDistance}
          />
        </div>
        <div className="mt-36">
          <SugestionsBoard sugestions={sugestoes} />
        </div>
      </div>

      <Legend />

      {markersLoading && (
        <div className="absolute inset-0 z-[900] flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow">
            <div className="h-6 w-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-700">
              Carregando camadas do mapa...
            </p>
          </div>
        </div>
      )}

      {/* Mapa */}
      <MapContainer
        center={[-27.0, -50.0]}
        zoom={4}
        scrollWheelZoom={true}
        className="h-[100vh] w-full rounded-xl shadow-md z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        />

        {/* Marcadores: Cama Aviária */}
        {camaAviaria.map((item, index) => (
          <Marker
            key={`cama-${index}`}
            position={[item.latitude, item.longitude]}
            icon={camaAviariaIcon}
            eventHandlers={{
              dblclick: () => handleMarkerDoubleClickUT(item),
            }}
          >
            <Popup>
              <strong>
                {item.nome}, {item.estado}
              </strong>
            </Popup>
          </Marker>
        ))}

        {/* Marcadores: Rocha Fosfato */}
        {rochaFosfato.map((item, index) => (
          <Marker
            key={`rocha-${index}`}
            position={[item.latitude, item.longitude]}
            icon={rochaFosfatoIcon}
            eventHandlers={{
              dblclick: () => handleMarkerDoubleClickUT(item),
            }}
          >
            <Popup>
              <strong>
                {item.nome}, {item.estado}
              </strong>
            </Popup>
          </Marker>
        ))}

        {/* Marcadores: Fertilizantes agrupados */}
        {fertilizantes.map((item, index) => (
          <Marker
            key={`fertilizante-${index}`}
            position={[item.latitude, item.longitude]}
            icon={fertilizantesIcon}
            eventHandlers={{
              dblclick: () => {
                toast.error(
                  "Esta cidade possui uma empresa de fertilizantes e não pode ser escolhida."
                );
              },
            }}
          >
            <Popup>
              {item.empresas.map((nome: string, i: number) => (
                <div key={i}>
                  <strong>🌱{nome}</strong>
                </div>
              ))}
              {item.cidade}, {item.uf}
            </Popup>
          </Marker>
        ))}

        {/* Marcadores: Sugestões de rota */}
        {sugestoes.map((item, index) => (
          <Marker
            key={`sugestao-${index}`}
            position={[item.latitude, item.longitude]}
            icon={sugestaoIcon}
          >
            <Popup className="text-sm">
              <strong>
                {item.nome},{item.estado.uf}
              </strong>
              <br />
              {(Number(item.distancia) / 1000).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              km
            </Popup>
          </Marker>
        ))}

        {/* Rota via rodovia */}
        {rotaCoordenadas.length > 0 && (
          <Polyline
            positions={rotaCoordenadas}
            pathOptions={{ color: "green", weight: 4, opacity: 0.8 }}
          />
        )}

        {/* Loading/Error States */}
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-500">Carregando...</p>
          </div>
        )}
        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-50/80 backdrop-blur-md rounded-lg p-4 shadow-md">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
      </MapContainer>
    </>
  );
}
