"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function Legend() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute bottom-16 left-6 z-[1000]">
      <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-xl shadow-xl w-72 transition-all duration-500 ease-in-out">
        {/* Cabeçalho com botão de toggle */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-gray-50 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm font-semibold text-gray-700">Legenda</span>
          {isOpen ? (
            <ChevronDownIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronUpIcon className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {/* Conteúdo colapsável */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen
              ? "max-h-[500px] opacity-100 p-4 pt-0"
              : "max-h-0 opacity-0 px-4"
          }`}
        >
          <ul className="space-y-3 text-gray-700 text-sm">
            <li className="flex items-center space-x-3">
              <img
                src="/icons/cama-aviaria-icon.png"
                alt="Cama Aviária"
                className="w-6 h-6 rounded-md border border-gray-300 shadow-sm"
              />
              <span className="tracking-wide">Cama Aviária</span>
            </li>
            <li className="flex items-center space-x-3">
              <img
                src="/icons/rocha-fosfato-icon.png"
                alt="Rocha Fosfato"
                className="w-6 h-6 rounded-md border border-gray-300 shadow-sm"
              />
              <span className="tracking-wide">Rocha Fosfato</span>
            </li>
            <li className="flex items-center space-x-3">
              <img
                src="/icons/fertilizante-icon.png"
                alt="Fertilizantes"
                className="w-6 h-6 rounded-md border border-gray-300 shadow-sm"
              />
              <span className="tracking-wide">Fertilizantes</span>
            </li>
            <li className="flex items-center space-x-3">
              <img
                src="/icons/sugestao-icon.png"
                alt="Sugestões"
                className="w-6 h-6 rounded-md border border-gray-300 shadow-sm"
              />
              <span className="tracking-wide">Sugestões de Rota</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
