import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { assetUrl } from "../../lib/api";

interface LightboxProps {
  images: { image_url: string; alt_text?: string | null }[];
  initialIndex?: number;
  title?: string;
  onClose: () => void;
}

const INTERVAL_MS = 2000;

export default function Lightbox({ images, initialIndex = 0, title, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [paused, setPaused] = useState(false);

  const go = (delta: number) => {
    setCurrent((prev) => (prev + delta + images.length) % images.length);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setCurrent((prev) => (prev + 1) % images.length);
      if (event.key === "ArrowLeft") setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [images.length, onClose]);

  // Slideshow: advances every 2s and loops, unless the user is pressing/hovering.
  useEffect(() => {
    if (paused || images.length < 2) return;

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [paused, images.length]);

  if (images.length === 0) return null;

  const active = images[current];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} images` : "Image viewer"}
      className="fixed inset-0 z-[70] flex flex-col bg-slate-950/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="truncate text-sm font-semibold text-white">{title || "Gallery"}</p>
        <div className="flex items-center gap-3">
          <span className="text-xs tabular-nums text-slate-400">
            {current + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div
        className="relative flex flex-1 select-none items-center justify-center overflow-hidden px-2 pb-2"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        {images.length > 1 && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="absolute left-2 z-10 rounded-full bg-slate-900/80 p-2.5 text-white transition hover:bg-slate-800 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <img
          key={active.image_url}
          src={assetUrl(active.image_url)}
          alt={active.alt_text || title || `Image ${current + 1}`}
          draggable={false}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        />

        {images.length > 1 && (
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-2 z-10 rounded-full bg-slate-900/80 p-2.5 text-white transition hover:bg-slate-800 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 px-4 pb-5 pt-2">
        {images.length > 1 && (
          <div className="flex items-center gap-2">
            {images.map((image, index) => (
              <button
                key={`${image.image_url}-${index}`}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={() => setCurrent(index)}
                className={`h-1.5 rounded-full transition-all ${
                  current === index ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
        <p className="text-center text-[11px] text-slate-500">
          {images.length > 1 ? "Changes every 2s · press or hover to hold" : "Press Esc or tap ✕ to close"}
        </p>
      </div>
    </div>
  );
}
