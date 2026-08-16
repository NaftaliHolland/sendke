import { fitAspectRect } from "@/data/poster-sizes";
import type { PosterSize } from "@/types/PosterSize";
import { cn } from "@/lib/utils";

interface SizePickerProps {
  sizes: PosterSize[];
  selectedSize: PosterSize;
  onSizeSelect: (size: PosterSize) => void;
}

export function SizePicker({
  sizes,
  selectedSize,
  onSizeSelect,
}: SizePickerProps) {
  return (
    <div className="w-full max-w-lg mt-4 md:mt-3">
      <h3 className="text-lg md:text-base font-bold text-gray-800">Print size</h3>
      <p className="text-sm text-gray-500 mt-1 mb-3 md:hidden">
        Pick the shape you'll print or share
      </p>
      <div
        role="radiogroup"
        aria-label="Print size"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"
      >
        {sizes.map((size) => {
          const selected = selectedSize.slug === size.slug;
          const thumb = fitAspectRect(size.width, size.height, 44, 28);

          return (
            <button
              key={size.slug}
              type="button"
              role="radio"
              aria-checked={selected}
              title={`${size.name} · ${size.physicalLabel}`}
              onClick={() => onSizeSelect(size)}
              className={cn(
                "flex flex-col items-start text-left rounded-lg border p-3 md:p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600",
                selected
                  ? "bg-gray-800 text-white border-gray-800 ring-2 ring-green-500"
                  : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
              )}
            >
              <div className="h-10 md:h-7 w-full flex items-center justify-center mb-2 md:mb-1">
                <span
                  className={selected ? "bg-green-400" : "bg-gray-300"}
                  style={{
                    width: thumb.width,
                    height: thumb.height,
                    display: "block",
                  }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-sm md:text-[11px] font-medium leading-tight">
                {size.name}
              </span>
              <span
                className={cn(
                  "text-xs mt-1 md:hidden",
                  selected ? "text-gray-300" : "text-gray-500"
                )}
              >
                {size.physicalLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
