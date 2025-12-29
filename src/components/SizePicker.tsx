"use client";


const SIZES = ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"];

export interface SizePickerProps {
  sizes: {
    id: string;
    name: string;
    inStock: number | undefined;
  }[] | [];
  selectedSizeId: string | null;
  onChange: (sizeId: string | null) => void;
  className?: string;
}

export default function SizePicker({ className = "", sizes, selectedSizeId, onChange }: SizePickerProps) {

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-body-medium text-dark-900">Select Size</p>
        <button className="text-caption text-dark-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]">
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {sizes.map((s) => {
          const isActive = selectedSizeId === s.id;
          const isDisabled = s.inStock ? s.inStock === 0 ? true : false : false;
          return (
            <button
              key={s.id}
              disabled={isDisabled}
              onClick={() => onChange(isActive ? null : s.id)}
              className={`
                rounded-lg border px-3 py-3 text-body transition
                ${isDisabled
                  ? "border-light-300 text-light-400 cursor-not-allowed"
                  : isActive
                  ? "border-dark-900 text-dark-900"
                  : "border-light-300 text-dark-700 hover:border-dark-500"}
              `}
              aria-pressed={isActive}
            >
              {s.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}