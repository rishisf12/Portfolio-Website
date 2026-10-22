import { useState, useEffect } from "react";
import { fetchGitHubRepos } from "../../lib/github";
import { adminApi } from "../../lib/api";
import { ArrowLeft, ExternalLink, Import } from "lucide-react";
import { Link } from "react-router-dom";

export default function GitHubImport() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGitHubRepos("rishisf12").then(setRepos).finally(() => setLoading(false));
  }, []);

  const importRepo = async (repo: any) => {
    try {
      await adminApi.createProject({
        title: repo.name,
        slug: repo.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        summary: repo.description || "Imported from GitHub",
        description: `Project imported from ${repo.url}. Language: ${repo.language}. Stars: ${repo.stars}.`,
        tech_stack: repo.language || "Unknown",
        style_theme: "modern",
        is_published: false,
        category_id: 1,
        demo_url: repo.homepage || repo.url,
        github_url: repo.url,
      });
      alert("Imported: " + repo.name);
    } catch {
      alert("Import failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <Link to="/admin" className="inline-flex items-center gap-2 text-blue-400 mb-6"><ArrowLeft size={18}/> Dashboard</Link>
      <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-3"><Import size={28}/> GitHub Import</h1>
      <p className="text-slate-400 mb-8">Fetch your repositories and create portfolio projects automatically.</p>

      {loading ? (
        <div className="animate-pulse bg-slate-800 h-32 rounded-xl" />
      ) : repos.length === 0 ? (
        <p className="text-slate-400">No repos found or API unavailable.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((r: any) => (
            <div key={r.name} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-white">{r.name}</h3>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300"><ExternalLink size={14} /></a>
              </div>
              <p className="text-sm text-slate-400 mb-3 line-clamp-2">{r.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded">{r.language}</span>
                <span className="text-xs bg-amber-900/30 text-amber-300 px-2 py-0.5 rounded">★ {r.stars}</span>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{r.topics?.slice(0,3).join(", ") || "—"}</span>
              </div>
              <button onClick={() => importRepo(r)} className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition">Import to Portfolio</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}