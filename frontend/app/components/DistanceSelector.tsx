import React, { useState } from "react";

interface DistanceSelectorProps {
  initialDistance: number; // Distância inicial em km
  onDistanceChange: (newDistance: number) => void; // Função para notificar o componente pai
}

const DistanceSelector: React.FC<DistanceSelectorProps> = ({
  initialDistance,
  onDistanceChange,
}) => {
  const [distance, setDistance] = useState(initialDistance);

  const handleDistanceChange = (newDistance: number) => {
    setDistance(newDistance);
    onDistanceChange(newDistance);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-sm font-medium">
        Distância Máxima: {distance} km
      </label>
      <input
        type="range"
        min="200"
        max="600"
        step="50"
        value={distance}
        onChange={(e) => handleDistanceChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
};

export default DistanceSelector;
