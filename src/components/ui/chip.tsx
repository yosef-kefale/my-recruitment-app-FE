import { X } from "lucide-react";

interface ChipProps {
  label: string;
  onRemove?: () => void;
}

const Chip = ({ label, onRemove }: ChipProps) => {
  return (
    <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
      <span>{label}</span>
      {onRemove && (
        <button onClick={onRemove} className="text-gray-600 hover:text-gray-800">
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Chip;
