import { useState, useEffect } from "react";
import { publicApi, adminApi } from "../../lib/api";
import { Link } from "react-router-dom";
import { Plus, Trash2, Pencil, Settings, GraduationCap, Award } from "lucide-react";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [count, setCount] = useState({ total: 0, published: 0, skills: 0 });

  useEffect(() => {
    publicApi.projects().then(r => { const p = r.data || []; setProjects(p); setCount({ total: p.length, published: p.filter((x: any) => x.is_published).length, skills: 0 }); }).catch(() => {});
    adminApi.skills().then(r => setCount(c => ({ ...c, skills: (r.data || []).length })));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <nav className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-extrabold text-lg">RS</span>
            </div>
            <div>
              <h1 className="font-bold text-white leading-none">Admin Panel</h1>
              <p className="text-xs text-slate-400">rishisf12 • Full Stack Portfolio</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-slate-300 hover:text-white transition">Visit Site</Link>
            <a href="/admin/login" className="text-sm text-red-400 hover:text-red-300">Logout</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-900/30 rounded-2xl p-6 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <p className="text-sm text-blue-200/70 font-medium mb-1">Total Projects</p>
            <p className="text-4xl font-extrabold text-white">{count.total}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-900/30 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-emerald-200/70 font-medium mb-1">Published</p>
            <p className="text-4xl font-extrabold text-white">{count.published}</p>
          </div>
          <div className="bg-gradient-to-br from-violet-900/40 to-violet-800/20 border border-violet-900/30 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-violet-200/70 font-medium mb-1">Skills</p>
            <p className="text-4xl font-extrabold text-white">{count.skills}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <Link to="/admin/project-form" className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 transition shadow-lg hover:shadow-blue-900/20">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Plus size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Add Project</h3>
            <p className="text-sm text-slate-400">Create new project with images, description, and demo links.</p>
          </Link>
          <Link to="/admin/projects" className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition shadow-lg hover:shadow-emerald-900/20">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Pencil size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Manage Projects</h3>
            <p className="text-sm text-slate-400">Edit, update, delete, and publish projects.</p>
          </Link>
          <Link to="/admin/settings" className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-violet-500/50 transition shadow-lg hover:shadow-violet-900/20">
            <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Settings size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Site Settings</h3>
            <p className="text-sm text-slate-400">Edit bio, socials, theme, and resume.</p>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={20} className="text-blue-400" />
              <h3 className="font-bold text-white">Education</h3>
            </div>
            <Link to="/admin/education" className="inline-block text-sm text-blue-400 hover:text-blue-300 font-medium">Manage Education →</Link>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award size={20} className="text-amber-400" />
              <h3 className="font-bold text-white">Achievements</h3>
            </div>
            <Link to="/admin/achievements" className="inline-block text-sm text-blue-400 hover:text-blue-300 font-medium">Manage Achievements →</Link>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-4">Recent Projects</h2>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-800/50 text-slate-300 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p: any) => (
                <tr key={p.id} className="border-t border-slate-800 hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-medium text-white">{p.title}</td>
                  <td className="px-4 py-3 text-slate-400">{p.category?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${p.is_published ? "bg-emerald-900/30 text-emerald-400" : "bg-amber-900/30 text-amber-400"}`}>
                      {p.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to={`/project/${p.slug}`} className="text-blue-400 hover:text-blue-300 text-xs">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}