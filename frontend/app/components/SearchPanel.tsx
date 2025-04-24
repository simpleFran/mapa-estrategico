"use client";

import { useState } from "react";
import { toast } from "sonner";

const citiesCama = ["Chapecó", "Toledo", "Umuarama"]; // exemplo
const citiesRocha = ["Catalão", "Araxá", "Patos de Minas"]; // exemplo

export function SearchPanel({
    searchAction,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchAction: (points: any[]) => void;
}) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("chegou?",origin, destination)
    if (!origin || !destination) {
      toast.warning("Selecione as duas cidades!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/routes/nearest?origin=${origin}&destination=${destination}`
      );
      console.log("CHEGOU?",res)
      if (!res.ok) throw new Error("Erro na requisição");

      const data = await res.json();
      searchAction(data);
      toast.success("Cidades próximas encontradas!");
    } catch (err) {
      toast.error("Erro ao buscar dados do backend");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white shadow-lg rounded-xl absolute top-4 left-1/2 -translate-x-1/2 z-[1000]"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cidade origem (tipo 1)
        </label>
        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">Selecione</option>
          {[...citiesCama, ...citiesRocha].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cidade destino (tipo 2)
        </label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">Selecione</option>
          {[...citiesCama, ...citiesRocha].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Buscar
      </button>
    </form>
  );
}
