import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { publicApi } from "../../lib/api";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid({ categorySlug, sectionTitle }: { categorySlug: string; sectionTitle: string }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    publicApi
      .projects(categorySlug)
      .then((res) => {
        if (!cancelled) {
          setProjects(res.data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p: any) =>
      [p.title, p.summary, p.tech_stack].filter(Boolean).some((v: string) => v.toLowerCase().includes(q))
    );
  }, [projects, query]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </p>
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${sectionTitle.toLowerCase()}…`}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 py-14 text-center text-slate-400">
          {projects.length === 0 ? (
            <>
              No {sectionTitle.toLowerCase()} projects yet. Add them from the{" "}
              <Link to="/admin" className="text-blue-400 underline">
                admin dashboard
              </Link>
              .
            </>
          ) : (
            <>No projects match “{query}”.</>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
