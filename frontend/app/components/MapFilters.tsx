"use client";

import { useEffect, useState } from "react";

export default function MapFilters({
  onSelecionar,
}: {
  onSelecionar: (origemId: number, destinoId: number) => void;
}) {
  const [camas, setCamas] = useState<any[]>([]);
  const [rochas, setRochas] = useState<any[]>([]);
  const [origemId, setOrigemId] = useState<number | null>(null);
  const [destinoId, setDestinoId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cama-aviaria")
      .then((res) => res.json())
      .then(setCamas);
    fetch("/api/rocha-fosfato")
      .then((res) => res.json())
      .then(setRochas);
  }, []);

  useEffect(() => {
    if (origemId && destinoId) {
      onSelecionar(origemId, destinoId);
    }
  }, [origemId, destinoId]);

  return (
    <div className="p-4 bg-white shadow rounded flex gap-4 z-50 absolute top-4 left-4">
      <div>
        <label>Origem (Cama Aviária)</label>
        <br />
        <select onChange={(e) => setOrigemId(Number(e.target.value))}>
          <option value="">Selecione</option>
          {camas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} - {c.estado}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Destino (Rocha Fosfato)</label>
        <br />
        <select onChange={(e) => setDestinoId(Number(e.target.value))}>
          <option value="">Selecione</option>
          {rochas.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome} - {r.estado}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
