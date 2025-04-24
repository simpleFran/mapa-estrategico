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

  useEffect(() => {
    // fetchCamaAviaria().then(setCamaAviaria);
    // fetchRochaFosfato().then(setRochaFosfato);

     fetchCamaAviaria().then((data) => {
       console.log("Dados de Cama Aviária:", data); 
       setCamaAviaria(data);
     });

     fetchRochaFosfato().then((data) => {
       console.log("Dados de Rocha Fosfato:", data);
       setRochaFosfato(data);
     });


    fetchEmpresasFertilizantes().then((dados) => {
      const agrupadas = dados.reduce((acc: any, item: any) => {
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
    });

    fetchCidadesOrigemDestino().then(setCidadesOrigemDestino);
  }, []);

  useEffect(() => {
    if (cidadeCamaAviaria?.codigo_ibge && cidadeRochaFosfato?.codigo_ibge) {
      setLoading(true);
      setError(null);
      fetchSugestoes(
        cidadeCamaAviaria.codigo_ibge,
        cidadeRochaFosfato.codigo_ibge
      )
        .then((res) => {
          console.log("Resposta do backend:", res); // Log para depuração
          setSugestoes(res.sugestoes);
          setRotaCoordenadas(res.rotasCoordenadas); // Atualiza as coordenadas da rota
        })
        .catch((err) => {
          console.error("Erro ao buscar sugestões:", err);
          setError("Ocorreu um erro ao calcular a rota.");
        })
        .finally(() => setLoading(false));
    }
  }, [cidadeCamaAviaria, cidadeRochaFosfato]);

  //funcao auxiliar - verifica se cidade é do tipo Cama Aviaria
  const isCamaAviaria = (cidade: any) => {
    return camaAviaria.some((item) => item.codigo_ibge === cidade.codigo_ibge);
  };
  const isRochaFosfato = (cidade: any) => {
    return rochaFosfato.some((item) => item.codigo_ibge === cidade.codigo_ibge);
  };
  function handleMarkerDoubleClick(cidade: any) {
    if (isCamaAviaria(cidade)) {
      if (cidadeCamaAviaria) {
        toast.error(
          "Você já escolheu uma cidade com Cama Aviária. Escolha uma cidade com Rocha de Fosfato."
        );
        return;
      }
      setCidadeCamaAviaria(cidade);
      toast.success(
        `${cidade.nome} - ${cidade.estado} definida como Cama Aviária.`
      );
      return;
    }

    if (isRochaFosfato(cidade)) {
      if (cidadeRochaFosfato) {
        toast.error(
          "Você já escolheu uma cidade com Rocha Fosfato. Escolha uma cidade com Cama Aviária."
        );
        return;
      }
      setCidadeRochaFosfato(cidade);
      toast.success(
        `${cidade.nome} - ${cidade.estado} definida como Rocha Fosfato.`
      );
      return;
    }

    // Se a cidade não for nem Cama Aviária nem Rocha Fosfato, assumimos que é uma empresa de fertilizantes
    toast.error(
      "Esta cidade possui uma empresa de fertilizantes e não pode ser escolhida."
    );
  }

  return (
    <>
      {/* Selects fixos no canto superior esquerdo */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded shadow-md">
        <label className="block mb-2 font-bold">Cidades | Cama Aviária:</label>
        <CitySelectCamaAviaria onChange={setCidadeCamaAviaria} />

        <label className="block mb-2 font-bold">
          Cidades | Rocha de Fosfato:
        </label>
        <CitySelectRochaFosfato onChange={setCidadeRochaFosfato} />
      </div>

      <Legend />

      {/* Mapa */}
      <MapContainer
        center={[-27.0, -50.0]}
        zoom={6}
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
              dblclick: () => handleMarkerDoubleClick(item),
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
              dblclick: () => handleMarkerDoubleClick(item),
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
              {Number(item.distancia) / 1000} km
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
