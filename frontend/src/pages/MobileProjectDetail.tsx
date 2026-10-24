import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { assetUrl, publicApi } from "../lib/api";
import BottomNav from "../components/mobile/BottomNav";
import Lightbox from "../components/ui/Lightbox";

export default function MobileProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    publicApi
      .projectDetail(slug!)
      .then((res) => {
        if (!alive) return;
        setProject(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  const images: Array<{ image_url: string; alt_text?: string }> = project?.images || [];

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
  };

  const goToImage = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (images.length < 2 || paused || lightboxIndex !== null) return;
    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const active = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      const next = (active + 1) % images.length;
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    }, 2500);
    return () => window.clearInterval(timer);
  }, [images.length, paused, lightboxIndex]);

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100"
      style={{ paddingBottom: "calc(4.75rem + env(safe-area-inset-bottom))" }}
    >
      <header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/90 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4">
          <Link
            to="/"
            aria-label="Back to home"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 text-slate-300"
          >
            <ArrowLeft size={17} />
          </Link>
          <span className="truncate text-sm font-semibold text-white">
            {project?.title || "Project"}
          </span>
        </div>
      </header>

      {loading && (
        <div className="px-4 py-6">
          <div className="h-52 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50" />
          <div className="mt-4 h-8 w-2/3 animate-pulse rounded bg-slate-900" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-900" />
        </div>
      )}

      {!loading && !project && (
        <div className="flex flex-col items-center gap-4 px-4 py-20">
          <p className="text-sm text-slate-300">Project not found.</p>
          <Link to="/" className="text-sm font-semibold text-blue-400">
            ← Back to home
          </Link>
        </div>
      )}

      {project && (
        <>
          {images.length > 0 && (
            <div className="relative">
              <div
                ref={trackRef}
                onScroll={onScroll}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
                onPointerDown={() => setPaused(true)}
                onPointerUp={() => setPaused(false)}
                className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
              >
                {images.map((image, imageIndex) => (
                  <button
                    key={imageIndex}
                    type="button"
                    onClick={() => setLightboxIndex(imageIndex)}
                    aria-label={`Enlarge image ${imageIndex + 1}`}
                    className="w-full shrink-0 snap-center bg-slate-900"
                  >
                    <img
                      src={assetUrl(image.image_url)}
                      alt={image.alt_text || project.title}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {images.length > 1 && (
                <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                  {images.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      aria-label={`Image ${dotIndex + 1}`}
                      onClick={() => goToImage(dotIndex)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === dotIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="px-4 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              {project.category?.name && (
                <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-300">
                  {project.category.name}
                </span>
              )}
              {project.style_theme && (
                <span className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  {project.style_theme}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white">{project.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{project.summary}</p>

            <div className="mt-5 flex flex-col gap-2.5">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white active:from-blue-500 active:to-indigo-500"
                >
                  <ExternalLink size={16} /> Live demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-slate-700 text-sm font-semibold text-slate-200 active:bg-slate-900"
                >
                  <Github size={16} /> Source code
                </a>
              )}
            </div>
          </div>

          <section className="mt-6 border-t border-slate-900 px-4 py-5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tech stack</h2>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {(project.tech_stack || "")
                .split(",")
                .map((tag: string) => tag.trim())
                .filter(Boolean)
                .map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-md border border-slate-800 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </section>

          <section className="border-t border-slate-900 px-4 py-5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              About this project
            </h2>
            <div className="mt-2.5 space-y-3">
              {(project.description || "")
                .split("\n\n")
                .filter(Boolean)
                .map((paragraph: string, paragraphIndex: number) => (
                  <p key={paragraphIndex} className="text-sm leading-relaxed text-slate-300">
                    {paragraph}
                  </p>
                ))}
            </div>
          </section>
        </>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          title={project?.title}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
