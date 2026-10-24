import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Github } from "lucide-react";
import { assetUrl } from "../../lib/api";

interface MobileProjectCardProps {
  project: {
    id: number;
    title: string;
    slug: string;
    summary: string;
    tech_stack: string;
    github_url?: string | null;
    category?: { name: string; slug: string };
    images: Array<{ image_url: string }>;
  };
}

export default function MobileProjectCard({ project }: MobileProjectCardProps) {
  const tags = (project.tech_stack || "").split(",").map((t) => t.trim()).filter(Boolean);
  const images = project.images ?? [];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const image = images[current]?.image_url || images[0]?.image_url;
  const technical = project.category?.slug !== "mechanical";

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const timer = window.setInterval(() => {
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    }, 2500);
    return () => window.clearInterval(timer);
  }, [images.length, paused]);

  return (
    <article
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <Link to={`/project/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] bg-slate-950">
          {image ? (
            <img
              src={assetUrl(image)}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-600">No image</div>
          )}
          <span
            className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${
              technical ? "bg-blue-600/90" : "bg-emerald-600/90"
            }`}
          >
            {project.category?.name || "Project"}
          </span>
          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {current + 1}/{images.length}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-base font-bold leading-snug text-white">{project.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-400">{project.summary}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-slate-800 bg-slate-950/70 px-2 py-0.5 text-[11px] text-slate-300"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="rounded-md bg-slate-950/70 px-2 py-0.5 text-[11px] text-slate-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
        <Link
          to={`/project/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400"
        >
          View project <ArrowRight size={14} />
        </Link>
        {project.github_url ? (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400"
          >
            <Github size={13} /> Source
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-slate-600">
            <Github size={13} /> Private
          </span>
        )}
      </div>
    </article>
  );
}
