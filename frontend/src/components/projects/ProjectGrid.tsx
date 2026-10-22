import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, GitHub } from "lucide-react";
import { publicApi } from "../../lib/api";

export default function ProjectGrid({ categorySlug, sectionTitle }: { categorySlug: string; sectionTitle: string }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicApi
      .projects(categorySlug)
      .then((res) => { if (!cancelled) { setProjects(res.data || []); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [categorySlug]);

  if (loading) return (
    <div className="grid md:grid-cols-3 gap-6">
      {[1,2,3].map(i => (
        <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl h-72" />
      ))}
    </div>
  );

  if (projects.length === 0) return (
    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
      No {sectionTitle.toLowerCase()} projects yet. Add them in <Link to="/admin/login" className="text-blue-600 dark:text-blue-400 underline">Admin</Link>.
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id={`project-grid-${sectionTitle.toLowerCase()}`}>
      {projects.map((p: any) => (
        <Link key={p.id} to={`/project/${p.slug}`} className="group block">
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-48 overflow-hidden">
              <img
                src={p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-blue-600/90 text-white shadow">{p.category?.name || sectionTitle}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-900/70 text-white">{p.style_theme}</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{p.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{p.summary}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(p.tech_stack || "").split(",").map((t: string, i: number) => (
                  <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-300 rounded-md">{t.trim()}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1"><ExternalLink size={12} /> Demo</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1"><GitHub size={12} /> Source</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}