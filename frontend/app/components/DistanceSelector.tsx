'use client'
import { useState } from "react";

interface DistanceSelectorProps {
  onDistanceChange: (distanceInMeters: number) => void;
}

export const DistanceSelector = ({ onDistanceChange }: DistanceSelectorProps) => {
  const [distance, setDistance] = useState(200); // Limite inicial: 200 km

  const handleDistanceChange = (newDistance: number) => {
    setDistance(newDistance);
    onDistanceChange(newDistance * 1000); // Converte km para metros
  };

  return (
    <div>
      <label>Distância máxima: {distance} km</label>
      <input
        type="range"
        min="200"
        max="500"
        step="50"
        value={distance}
        onChange={(e) => handleDistanceChange(Number(e.target.value))}
      />
    </div>
  );
};
