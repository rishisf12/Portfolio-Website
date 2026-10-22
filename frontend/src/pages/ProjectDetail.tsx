import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../lib/api";
import ImageCarousel from "../components/projects/ImageCarousel";
import { ExternalLink, GitHub } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <span className="text-slate-400">Loading...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <span className="text-slate-400">Project not found</span>
      </div>
    );
  }

  const techTags = project.tech_stack.split(",").map((t: string) => t.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">RS</a>
          <a href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">← Back to Home</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <span className="px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
            {project.style_theme}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {project.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">{project.summary}</p>

          <div className="flex items-center gap-4">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow"
              >
                <ExternalLink size={18} /> Live Demo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 border border-slate-600 dark:border-slate-400 text-slate-600 dark:text-slate-400 hover:bg-slate-600 dark:hover:bg-slate-400 hover:text-white rounded-lg font-semibold transition"
              >
                <GitHub size={18} /> Source Code
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
                Project Images
              </h3>
              <ImageCarousel images={project.images} />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {techTags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Description</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {project.description.split("\n\n").map((para: string, i: number) => (
                <p key={i} className="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
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