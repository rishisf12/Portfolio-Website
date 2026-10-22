import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { adminApi } from "../../lib/api";

export default function ProjectForm() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    tech_stack: "TensorFlow, Python",
    style_theme: "modern",
    is_published: true,
    category_id: 1,
    demo_url: "",
    github_url: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminApi.createProject(form);
      if (images.length > 0) {
        for (const f of images) {
          const fd = new FormData();
          fd.append("image_url", f.name); // note: real upload uses file data
          await adminApi.uploadImage(res.data.id, fd);
        }
      }
      alert("Project saved!");
      setForm({ ...form, title: "", slug: "", summary: "", description: "" });
      setImages([]);
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <Link to="/admin" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 font-medium"><ArrowLeft size={18}/> Back to Dashboard</Link>
      <h1 className="text-3xl font-extrabold mb-2">Add Project</h1>
      <p className="text-slate-400 mb-8">Create a new portfolio entry. All fields are editable later.</p>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5 backdrop-blur-md">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="AI Image Classifier" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1">Slug *</label>
            <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ai-image-classifier" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1">Category</label>
            <select value={form.category_id} onChange={e => setForm({ ...form, category_id: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white">
              <option value={1}>Technical</option>
              <option value={2}>Mechanical</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1">Tech Stack</label>
            <input value={form.tech_stack} onChange={e => setForm({ ...form, tech_stack: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white" placeholder="TensorFlow, Python" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1">Theme</label>
            <input value={form.style_theme} onChange={e => setForm({ ...form, style_theme: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white" placeholder="modern" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-1">Summary</label>
          <input value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white" placeholder="Brief description for card" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white" placeholder="Detailed explanation of the project..." />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1">Demo URL</label>
            <input value={form.demo_url} onChange={e => setForm({ ...form, demo_url: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white" placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1">GitHub URL</label>
            <input value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white" placeholder="https://github.com/..." />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-1">Project Images (optional)</label>
          <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files || []))} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-300" />
          {images.length > 0 && (
            <p className="text-xs text-slate-400 mt-2">{images.map(i => i.name).join(", ")}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Save size={18} /> {saving ? "Saving..." : "Save Project"}
          </button>
          <button type="button" onClick={() => { setForm({ ...form, title: "", slug: "", summary: "", description: "" }); setImages([]); }} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition">Clear</button>
        </div>
      </form>
    </div>
  );
}