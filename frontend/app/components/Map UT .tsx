// // app/components/Map.tsx

// "use client";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { Icon } from "leaflet";
// import { useEffect, useState } from "react";
// import {
//   fetchCamaAviaria,
//   fetchRochaFosfato,
//   fetchEmpresasFertilizantes,
// } from "../services/mapService";

// // Ícones personalizados
// const camaAviariaIcon = new Icon({
//   iconUrl: "/icons/cama-aviaria-icon.png",
//   iconSize: [25, 25],
//   iconAnchor: [12, 12],
// });

// const rochaFosfatoIcon = new Icon({
//   iconUrl: "/icons/rocha-fosfato-icon.png",
//   iconSize: [25, 25],
//   iconAnchor: [12, 12],
// });

// const fertilizantesIcon = new Icon({
//   iconUrl: "/icons/fertilizante-icon.png",
//   iconSize: [25, 25],
//   iconAnchor: [12, 12],
// });

// export default function Map() {
//   const [camaAviaria, setCamaAviaria] = useState<any[]>([]);
//   const [rochaFosfato, setRochaFosfato] = useState<any[]>([]);
//   const [fertilizantes, setFertilizantes] = useState<any[]>([]);

//   useEffect(() => {
//     fetchCamaAviaria().then(setCamaAviaria);
//     fetchRochaFosfato().then(setRochaFosfato);
//     fetchEmpresasFertilizantes().then(setFertilizantes);
//   }, []);

//   return (
//     <MapContainer
//       center={[-27.0, -50.0]}
//       zoom={6}
//       scrollWheelZoom={true}
//       className="h-[100vh] w-full rounded-xl shadow-md z-0"
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
//       />

//       {/* Marcadores: Cama Aviária */}
//       {camaAviaria.map(
//         (item, index) => (
//           console.log("cama-aviaria", item),
//           (
//             <Marker
//               key={`cama-${index}`}
//               position={[item.latitude, item.longitude]}
//               icon={camaAviariaIcon}
//             >
//               <Popup>
//                 <strong>
//                   {item.nome}, {item.estado}
//                 </strong>
//               </Popup>
//             </Marker>
//           )
//         )
//       )}

//       {/* Marcadores: Rocha Fosfato */}
//       {rochaFosfato.map((item, index) => (
//         <Marker
//           key={`rocha-${index}`}
//           position={[item.latitude, item.longitude]}
//           icon={rochaFosfatoIcon}
//         >
//           <Popup>
//             <strong>
//               {item.nome}, {item.estado}
//             </strong>
//           </Popup>
//         </Marker>
//       ))}

//       {/* Marcadores: Fertilizantes */}
//       {fertilizantes.map((item, index) => (
//         <Marker
//           key={`fertilizante-${index}`}
//           position={[item.latitude, item.longitude]}
//           icon={fertilizantesIcon}
//         >
//           <Popup>
//             <strong>{item.nome}</strong>
//             <br />
//             {item.cidade}, {item.uf}
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }
