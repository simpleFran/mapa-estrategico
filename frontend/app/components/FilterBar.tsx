// app/components/FilterBar.tsx
type Props = {
  selectedTypes: string[];
  onToggle: (type: string) => void;
};

const types = [
  { label: "Cama Aviária", value: "cama" },
  { label: "Rocha Fosfato", value: "rocha" },
  { label: "Fertilizante", value: "fertilizante" },
];

export default function FilterBar({ selectedTypes, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      
      {types.map((t) => (
        <button
          key={t.value}
          onClick={() => onToggle(t.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition
            ${
              selectedTypes.includes(t.value)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }
          `}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
