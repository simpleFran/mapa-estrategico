/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { fetchRochaFosfato } from "../services/mapService";

export default function CitySelectRochaFosfato({
  onChange,
}: {
  onChange: (city: any) => void;
}) {
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    fetchRochaFosfato().then((data) => setCities(data));
  }, []);

  return (
    <select
      className="w-full mb-4 border border-gray-300 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      onChange={(e) => {
        const selectedCity = cities.find(
          (city) => city.codigo_ibge == e.target.value
        );
        onChange(selectedCity);
      }}
    >
      <option value="">Selecionar Cidade</option>
      {cities.map((city) => (
        <option key={city.codigo_ibge} value={city.codigo_ibge}>
          {city.nome} - {city.estado || city.uf}
        </option>
      ))}
    </select>
  );
}
