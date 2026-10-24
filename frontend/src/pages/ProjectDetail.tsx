import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { publicApi } from "../lib/api";
import ImageCarousel from "../components/projects/ImageCarousel";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .projectDetail(slug!)
      .then((res) => {
        setProject(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <span className="text-slate-400">Loading…</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950">
        <p className="text-slate-300">Project not found.</p>
        <Link to="/" className="text-sm text-blue-400 hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  const techTags = (project.tech_stack || "").split(",").map((t: string) => t.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {project.category?.name && (
              <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-300">
                {project.category.name}
              </span>
            )}
            {project.style_theme && (
              <span className="rounded-md bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {project.style_theme}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
          <p className="text-lg text-slate-400 max-w-3xl">{project.summary}</p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
              >
                <ExternalLink size={17} /> Live Demo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-2.5 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                <Github size={17} /> Source Code
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ImageCarousel images={project.images || []} title={project.title} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {techTags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                About this project
              </h2>
              {project.description
                .split("\n\n")
                .map((para: string, i: number) => (
                  <p key={i} className="mb-3 text-sm leading-relaxed text-slate-300 last:mb-0">
                    {para}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
