import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: { image_url: string; alt_text?: string }[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
        <img src={images[0].image_url} alt={images[0].alt_text} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group">
      <img
        src={images[current].image_url}
        alt={images[current].alt_text}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full shadow hover:bg-white dark:hover:bg-slate-700 transition"
      >
        <ChevronLeft size={20} className="text-slate-600 dark:text-slate-200" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full shadow hover:bg-white dark:hover:bg-slate-700 transition"
      >
        <ChevronRight size={20} className="text-slate-600 dark:text-slate-200" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition ${
              current === idx ? "bg-blue-600" : "bg-slate-400/50 hover:bg-slate-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}