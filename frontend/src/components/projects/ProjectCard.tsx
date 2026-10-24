import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { assetUrl } from "../../lib/api";

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    slug: string;
    summary: string;
    tech_stack: string;
    style_theme: string;
    demo_url?: string;
    github_url?: string;
    category?: { name: string; slug: string };
    images: Array<{ id?: number; image_url: string; alt_text?: string }>;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const techTags = (project.tech_stack || "").split(",").map((t) => t.trim()).filter(Boolean);
  const images = project.images ?? [];
  const hasMultiple = images.length > 1;
  const isTechnical = project.category?.slug !== "mechanical";

  const primary = images[current]?.image_url || images[0]?.image_url;

  useEffect(() => {
    if (!hasMultiple || paused) return;
    const timer = window.setInterval(() => {
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    }, 2000);
    return () => window.clearInterval(timer);
  }, [hasMultiple, paused, images.length]);

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-950/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-48 overflow-hidden bg-slate-950">
        {primary ? (
          <img
            src={assetUrl(primary)}
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600 text-sm">No image</div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              isTechnical
                ? "bg-blue-500/90 text-white"
                : "bg-emerald-500/90 text-white"
            }`}
          >
            {project.category?.name || "Project"}
          </span>
          {project.style_theme && (
            <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
              {project.style_theme}
            </span>
          )}
        </div>

        {hasMultiple && (
          <>
            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.preventDefault();
                setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Next image"
              onClick={(e) => {
                e.preventDefault();
                setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 w-1.5 rounded-full ${idx === current ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
            <span className="absolute bottom-2 right-2 rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {current + 1}/{images.length}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/project/${project.slug}`}>
          <h3 className="mb-2 text-lg font-bold leading-tight text-white transition group-hover:text-blue-400">
            {project.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-2 text-sm text-slate-400">{project.summary}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {techTags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="rounded-md border border-slate-800 bg-slate-950/70 px-2 py-0.5 text-[11px] text-slate-300"
            >
              {tag}
            </span>
          ))}
          {techTags.length > 4 && (
            <span className="rounded-md bg-slate-950/70 px-2 py-0.5 text-[11px] text-slate-500">
              +{techTags.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-3">
          <Link
            to={`/project/${project.slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            <ExternalLink size={13} /> Details
          </Link>
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <Github size={13} /> Source
            </a>
          ) : (
            <span className="flex items-center gap-1 text-xs text-slate-600">
              <Github size={13} /> Private
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
