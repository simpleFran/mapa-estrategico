// import { calculateDistance } from "./calculateDistance";
// import { fertilizantes } from "@/utils/constants";

// export function findNearestCity(
//   lat: number,
//   lon: number,
//   maxDistance: number = 400 // Distância máxima em km
// ) {
//   const nearestCities = fertilizantes
//     .map((fertilizer) => {
//       const distance = calculateDistance(
//         lat,
//         lon,
//         fertilizer.latitude,
//         fertilizer.longitude
//       );
//       return { ...fertilizer, distance };
//     })
//     .filter((city) => city.distance <= maxDistance)
//     .sort((a, b) => a.distance - b.distance);

//   return nearestCities;
// }
