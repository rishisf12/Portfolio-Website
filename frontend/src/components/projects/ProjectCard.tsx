import { Link } from "react-router-dom";
import { ExternalLink, GitHub } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    slug: string;
    summary: string;
    tech_stack: string;
    style_theme: string;
    category?: { name: string; slug: string };
    images: Array<{ image_url: string }>;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const techTags = project.tech_stack.split(",").map((t) => t.trim()).filter(Boolean);
  const primaryImage = project.images[0]?.image_url || "https://via.placeholder.com/400x300";

  return (
    <Link to={`/project/${project.slug}`} className="block">
      <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={primaryImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-2 py-0.5 rounded text-xs font-medium border"
              className={
                project.category?.slug === "technical"
                  ? "border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "border-orange-100 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
              }
            >
              {project.category?.name || "General"}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {project.style_theme}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">
            {project.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {techTags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
              <ExternalLink size={14} className="mr-1" />
              View Demo
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500 font-semibold">
              <GitHub size={14} className="mr-1" />
              Source
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}