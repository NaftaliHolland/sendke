import { SizePicker } from "./size-picker";
import type { PosterSize } from "@/types/PosterSize";

interface PosterPreviewProps {
  previewUrl: string | null;
  isRendering: boolean;
  error: string | null;
  selectedSize: PosterSize;
  sizes: PosterSize[];
  onSizeSelect: (size: PosterSize) => void;
}

export function PosterPreview({
  previewUrl,
  isRendering,
  error,
  selectedSize,
  sizes,
  onSizeSelect,
}: PosterPreviewProps) {
  return (
    <div className="w-full md:w-1/2 flex flex-col items-center justify-start md:py-2 md:min-h-0 md:h-full md:overflow-y-auto">
      <div className="w-full max-w-lg">
        <div className="relative w-full">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview of your payment poster"
              width={selectedSize.width}
              height={selectedSize.height}
              className={`w-full max-h-[400px] md:max-h-[min(42vh,360px)] object-contain shadow-lg transition-opacity duration-200 ${
                isRendering ? "opacity-60" : "opacity-100"
              }`}
            />
          ) : (
            <div
              className="w-full max-h-[400px] md:max-h-[min(42vh,360px)] animate-pulse rounded-lg bg-white border-8 border-gray-800"
              style={{
                aspectRatio: `${selectedSize.width} / ${selectedSize.height}`,
              }}
              aria-hidden="true"
            />
          )}
          {isRendering && (
            <span className="sr-only" aria-live="polite">
              Updating poster preview
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-start justify-center text-center mt-1 md:mt-0">
        <p className="font-handwriting text-2xl md:text-lg text-gray-600 z-10">
          Preview of your poster
        </p>
        {error && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>

      <SizePicker
        sizes={sizes}
        selectedSize={selectedSize}
        onSizeSelect={onSizeSelect}
      />
    </div>
  );
}
