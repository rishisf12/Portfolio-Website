import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { assetUrl } from "../../lib/api";
import Lightbox from "../ui/Lightbox";

interface ImageCarouselProps {
  images: { image_url: string; alt_text?: string }[];
  title?: string;
}

export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || paused || lightboxOpen) return;
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => window.clearInterval(timer);
  }, [images.length, paused, lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-sm text-slate-500">
        No images yet
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
          aria-label="Enlarge image"
        >
          <img
            src={assetUrl(images[0].image_url)}
            alt={images[0].alt_text}
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition group-hover:opacity-100">
            <Maximize2 size={12} /> Enlarge
          </span>
        </button>

        {lightboxOpen && (
          <Lightbox
            images={images}
            initialIndex={0}
            title={title}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className="group relative aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
      >
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block h-full w-full cursor-zoom-in"
          aria-label="Open image viewer"
        >
          <img
            src={assetUrl(images[current].image_url)}
            alt={images[current].alt_text}
            className="h-full w-full object-cover transition-opacity duration-300"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition group-hover:opacity-100">
            <Maximize2 size={12} /> Enlarge
          </span>
        </button>

        <button
          aria-label="Previous image"
          onClick={() => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/80 p-2 text-white shadow hover:bg-slate-800 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          aria-label="Next image"
          onClick={() => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/80 p-2 text-white shadow hover:bg-slate-800 transition"
        >
          <ChevronRight size={20} />
        </button>

        <span className="absolute right-3 top-3 rounded-md bg-slate-950/80 px-2 py-0.5 text-[11px] font-semibold text-white">
          {current + 1} / {images.length}
        </span>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Image ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`h-2 w-2 rounded-full transition ${current === idx ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={current}
          title={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
