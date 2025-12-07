// "use client";

// import React from "react";
// import { camaAviaria, rochaFosfato, fertilizantes } from "@/utils/constants";

// type SummaryType = {
//   [state: string]: {
//     cama: number;
//     fosfato: number;
//     fertilizante: number;
//   };
// };

// export const StateSummary = () => {
//   const summary: SummaryType = {};

//   camaAviaria.forEach(({ state }) => {
//     if (!summary[state])
//       summary[state] = { cama: 0, fosfato: 0, fertilizante: 0 };
//     summary[state].cama += 1;
//   });

//   rochaFosfato.forEach(({ state }) => {
//     if (!summary[state])
//       summary[state] = { cama: 0, fosfato: 0, fertilizante: 0 };
//     summary[state].fosfato += 1;
//   });

//   fertilizantes.forEach(({ state }) => {
//     if (!summary[state])
//       summary[state] = { cama: 0, fosfato: 0, fertilizante: 0 };
//     summary[state].fertilizante += 1;
//   });

//   const sortedStates = Object.keys(summary).sort();

//   return (
//     <div className="w-full max-w-xl mx-auto p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-md">
//       <h2 className="text-xl font-bold mb-4 text-center">Resumo por Estado</h2>
//       <div className="grid grid-cols-1 gap-4">
//         {sortedStates.map((state) => (
//           <div
//             key={state}
//             className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4"
//           >
//             <h3 className="font-semibold text-lg mb-2">Estado: {state}</h3>
//             <ul className="space-y-1 text-sm">
//               <li>🐔 Cama Aviária: {summary[state].cama}</li>
//               <li>🪨 Rocha de Fosfato: {summary[state].fosfato}</li>
//               <li>🏭 Fertilizantes: {summary[state].fertilizante}</li>
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
