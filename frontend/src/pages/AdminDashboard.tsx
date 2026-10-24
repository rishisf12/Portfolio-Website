import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Award,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  Save,
  Settings as SettingsIcon,
  Trash2,
  Upload,
  Wrench,
  X,
} from "lucide-react";
import { adminApi, assetUrl } from "../lib/api";
import { SKILL_DOMAINS } from "../lib/skills";
import Lightbox from "../components/ui/Lightbox";
import { useAuth } from "../hooks/useAuth";

type Tab = "projects" | "skills" | "education" | "achievements" | "settings";

const EMPTY_PROJECT = {
  id: 0,
  title: "",
  slug: "",
  summary: "",
  description: "",
  tech_stack: "",
  style_theme: "modern",
  demo_url: "",
  github_url: "",
  is_published: true,
  category_slug: "technical",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [tab, setTab] = useState<Tab>("projects");
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [draftSettings, setDraftSettings] = useState<Record<string, string>>({});

  const [form, setForm] = useState<any>(null);
  const [skillForm, setSkillForm] = useState({ name: "", level: "Intermediate", domain: "Languages", category_slug: "technical" });
  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    grade: "",
    coursework: "",
    sort_order: "0",
  });
  const [editingEduId, setEditingEduId] = useState<number | null>(null);
  const [achForm, setAchForm] = useState({ title: "", issuer: "", date: "", description: "" });

  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<{ images: any[]; index: number } | null>(null);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const load = async () => {
    try {
      const [statsRes, projectsRes, skillsRes, eduRes, achRes, settingsRes] = await Promise.all([
        adminApi.stats(),
        adminApi.projects(),
        adminApi.skills(),
        adminApi.education(),
        adminApi.achievements(),
        adminApi.settings(),
      ]);
      setStats(statsRes.data);
      setProjects(projectsRes.data || []);
      setSkills(skillsRes.data || []);
      setEducation(eduRes.data || []);
      setAchievements(achRes.data || []);
      setSettings(settingsRes.data || {});
      setDraftSettings(settingsRes.data || {});
    } catch (error: any) {
      if (error?.response?.status === 401) {
        logout();
        navigate("/admin/login", { replace: true });
      } else {
        flash("Could not reach the backend.");
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const categories = useMemo(
    () => [
      { slug: "technical", name: "Technical" },
      { slug: "mechanical", name: "Mechanical" },
    ],
    []
  );

  const startNewProject = () => setForm({ ...EMPTY_PROJECT });

  const startEditProject = (project: any) =>
    setForm({
      id: project.id,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      tech_stack: project.tech_stack,
      style_theme: project.style_theme,
      demo_url: project.demo_url || "",
      github_url: project.github_url || "",
      is_published: project.is_published,
      category_slug: project.category?.slug || "technical",
    });

  const saveProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;
    setBusy(true);
    try {
      const payload = {
        title: form.title,
        summary: form.summary,
        description: form.description,
        tech_stack: form.tech_stack,
        style_theme: form.style_theme,
        demo_url: form.demo_url || null,
        github_url: form.github_url || null,
        is_published: form.is_published,
        category_slug: form.category_slug,
        slug: form.slug || undefined,
      };
      const saved = form.id
        ? await adminApi.updateProject(form.id, payload)
        : await adminApi.createProject(payload);
      await load();
      setForm({ ...EMPTY_PROJECT, id: saved.data.id });
      flash(form.id ? "Project updated." : "Project created.");
    } catch (error: any) {
      flash(error?.response?.status === 401 ? "Invalid admin token." : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const removeProject = async (id: number) => {
    if (!window.confirm("Delete this project and its images?")) return;
    await adminApi.deleteProject(id);
    if (form?.id === id) setForm(null);
    await load();
    flash("Project deleted.");
  };

  const togglePublished = async (project: any) => {
    await adminApi.updateProject(project.id, {
      title: project.title,
      summary: project.summary,
      description: project.description,
      tech_stack: project.tech_stack,
      style_theme: project.style_theme,
      demo_url: project.demo_url,
      github_url: project.github_url,
      is_published: !project.is_published,
      category_slug: project.category?.slug || "technical",
    });
    await load();
  };

  const uploadImage = async (projectId: number, files?: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        await adminApi.uploadImage(projectId, file);
      }
      await load();
      flash(files.length > 1 ? `${files.length} images uploaded.` : "Image uploaded.");
    } catch {
      flash("Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const removeImage = async (imageId: number) => {
    await adminApi.deleteImage(imageId);
    await load();
  };

  const addSkill = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!skillForm.name.trim()) return;
    await adminApi.createSkill(skillForm);
    setSkillForm({ name: "", level: "Intermediate", domain: "Languages", category_slug: "technical" });
    await load();
    flash("Skill added.");
  };

  const addEducation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!eduForm.institution.trim() || !eduForm.degree.trim()) return;

    const payload = {
      institution: eduForm.institution,
      degree: eduForm.degree,
      field_of_study: eduForm.field_of_study || null,
      start_date: eduForm.start_date || null,
      end_date: eduForm.end_date || null,
      grade: eduForm.grade || null,
      coursework: eduForm.coursework || null,
    };

    if (editingEduId !== null) {
      await adminApi.updateEducation(editingEduId, {
        ...payload,
        sort_order: Number(eduForm.sort_order) || 0,
      });
    } else {
      await adminApi.createEducation(payload);
    }

    setEditingEduId(null);
    setEduForm({
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      grade: "",
      coursework: "",
      sort_order: "0",
    });
    await load();
    flash(editingEduId !== null ? "Education entry updated." : "Education entry added.");
  };

  const startEditEducation = (entry: any) => {
    setEditingEduId(entry.id);
    setEduForm({
      institution: entry.institution || "",
      degree: entry.degree || "",
      field_of_study: entry.field_of_study || "",
      start_date: entry.start_date || "",
      end_date: entry.end_date || "",
      grade: entry.grade || "",
      coursework: entry.coursework || "",
      sort_order: String(entry.sort_order ?? 0),
    });
  };

  const addAchievement = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!achForm.title.trim()) return;
    await adminApi.createAchievement({
      ...achForm,
      issuer: achForm.issuer || null,
      description: achForm.description || null,
    });
    setAchForm({ title: "", issuer: "", date: "", description: "" });
    await load();
    flash("Achievement added.");
  };

  const saveSetting = async (key: string) => {
    await adminApi.updateSetting(key, draftSettings[key] ?? "");
    await load();
    flash(`Saved “${key}”.`);
  };

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "projects", label: "Projects", icon: LayoutDashboard, count: projects.length },
    { id: "skills", label: "Skills", icon: Wrench, count: skills.length },
    { id: "education", label: "Education", icon: GraduationCap, count: education.length },
    { id: "achievements", label: "Achievements", icon: Award, count: achievements.length },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Token session active · changes appear on the public site immediately.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg border border-slate-800 text-sm font-semibold text-slate-300 hover:border-slate-600 hover:text-white transition"
            >
              View site
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-800 text-sm font-semibold text-red-300 hover:border-red-500/40 hover:text-red-200 transition"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Projects", value: stats.projects },
              { label: "Published", value: stats.published },
              { label: "Skills", value: stats.skills },
              { label: "Achievements", value: stats.achievements },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {notice && (
          <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-200">
            {notice}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                tab === item.id
                  ? "bg-blue-600 text-white"
                  : "border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white"
              }`}
            >
              <item.icon size={15} /> {item.label}
              {typeof item.count === "number" && (
                <span className="rounded bg-black/20 px-1.5 text-xs">{item.count}</span>
              )}
            </button>
          ))}
        </div>

        {tab === "projects" && (
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-3">
              <button
                onClick={startNewProject}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white"
              >
                <Plus size={16} /> New project
              </button>

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setPreview({ images: project.images || [], index: 0 })
                    }
                    disabled={!project.images?.length}
                    title="Preview images"
                    className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-950 disabled:cursor-default"
                  >
                    {project.images?.[0] && (
                      <img
                        src={assetUrl(project.images[0].image_url)}
                        alt={project.title}
                        className="h-full w-full object-cover transition hover:opacity-80"
                      />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{project.title}</p>
                    <p className="truncate text-xs text-slate-400">
                      {project.category?.name || "—"} · {project.images?.length || 0} image(s)
                    </p>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                      project.is_published
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {project.is_published ? "Live" : "Draft"}
                  </span>
                  <div className="flex items-center gap-1">
                    <label
                      title="Upload images"
                      className="cursor-pointer rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                      <Upload size={15} />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          uploadImage(project.id, e.target.files);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                    <button
                      onClick={() => togglePublished(project)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                      title="Toggle published"
                    >
                      <Save size={15} />
                    </button>
                    <button
                      onClick={() => startEditProject(project)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="rounded p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              {form ? (
                <form
                  onSubmit={saveProject}
                  className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-white">
                      {form.id ? "Edit project" : "New project"}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setForm(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {[
                    ["title", "Title"],
                    ["summary", "Summary"],
                    ["tech_stack", "Tech stack (comma separated)"],
                    ["style_theme", "Style theme"],
                    ["demo_url", "Live demo URL"],
                    ["github_url", "GitHub URL"],
                  ].map(([key, label]) => (
                    <label key={key} className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-400">{label}</span>
                      <input
                        value={form[key] ?? ""}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </label>
                  ))}

                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-slate-400">Description</span>
                    <textarea
                      rows={4}
                      value={form.description ?? ""}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </label>

                  <div className="flex items-center gap-3">
                    <select
                      value={form.category_slug}
                      onChange={(e) => setForm({ ...form, category_slug: e.target.value })}
                      className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    >
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={form.is_published}
                        onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                        className="accent-blue-600"
                      />
                      Published
                    </label>
                  </div>

                  <button
                    disabled={busy}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                  >
                    {form.id ? "Save changes" : "Create project"}
                  </button>

                  {form.id ? (
                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <p className="text-xs font-medium text-slate-400">
                        Images ({(projects.find((p) => p.id === form.id)?.images || []).length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(projects.find((p) => p.id === form.id)?.images || []).map(
                          (image: any, imageIndex: number, all: any[]) => (
                            <div
                              key={image.id}
                              className="relative h-16 w-24 overflow-hidden rounded-lg border border-slate-800"
                            >
                              <button
                                type="button"
                                onClick={() => setPreview({ images: all, index: imageIndex })}
                                title="Preview"
                                className="h-full w-full cursor-zoom-in"
                              >
                                <img
                                  src={assetUrl(image.image_url)}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                aria-label="Remove image"
                                className="absolute right-1 top-1 rounded bg-slate-950/80 p-1 text-red-300"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 py-2 text-xs text-slate-400 hover:border-blue-500 hover:text-blue-300">
                        <Upload size={14} /> Upload images (select one or more)
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            uploadImage(form.id, e.target.files);
                            e.currentTarget.value = "";
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Create the project first, then upload images.</p>
                  )}
                </form>
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
                  Select a project to edit, or create a new one.
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "skills" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={addSkill} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="font-semibold text-white">Add skill</h2>
              <input
                placeholder="Skill name"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              />
              <select
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              >
                {["Beginner", "Intermediate", "Advanced", "Expert"].map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
              <select
                value={skillForm.domain}
                onChange={(e) => setSkillForm({ ...skillForm, domain: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              >
                {SKILL_DOMAINS.map((domain) => (
                  <option key={domain}>{domain}</option>
                ))}
              </select>
              <select
                value={skillForm.category_slug}
                onChange={(e) => setSkillForm({ ...skillForm, category_slug: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                Add skill
              </button>
            </form>

            <div className="space-y-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{skill.name}</p>
                    <p className="text-xs text-slate-500">
                      {skill.domain ? `${skill.domain} · ` : ""}
                      {skill.category || "Technical"} · {skill.level}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      await adminApi.deleteSkill(skill.id);
                      await load();
                    }}
                    className="rounded p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "education" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={addEducation} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="font-semibold text-white">
                {editingEduId !== null ? "Edit education" : "Add education"}
              </h2>
              {[
                ["institution", "Institution"],
                ["degree", "Degree"],
                ["field_of_study", "Field of study"],
                ["start_date", "Start year"],
                ["end_date", "End year"],
                ["grade", "Grade / CGPA"],
                ["coursework", "Coursework"],
              ].map(([key, label]) => (
                <input
                  key={key}
                  placeholder={label}
                  value={(eduForm as any)[key]}
                  onChange={(e) => setEduForm({ ...eduForm, [key]: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                />
              ))}
              <input
                type="number"
                placeholder="Sort order (0 first)"
                value={eduForm.sort_order}
                onChange={(e) => setEduForm({ ...eduForm, sort_order: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                  {editingEduId !== null ? "Save changes" : "Add education"}
                </button>
                {editingEduId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEduId(null);
                      setEduForm({
                        institution: "",
                        degree: "",
                        field_of_study: "",
                        start_date: "",
                        end_date: "",
                        grade: "",
                        coursework: "",
                        sort_order: "0",
                      });
                    }}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-2">
              {education.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{entry.degree}</p>
                      <p className="text-xs text-blue-300">{entry.institution}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {[entry.start_date, entry.end_date].filter(Boolean).join(" – ")} {entry.grade ? `· ${entry.grade}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEditEducation(entry)}
                        aria-label="Edit education"
                        className="rounded p-1.5 text-slate-400 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await adminApi.deleteEducation(entry.id);
                          await load();
                        }}
                        aria-label="Delete education"
                        className="rounded p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "achievements" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={addAchievement} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="font-semibold text-white">Add achievement</h2>
              {[
                ["title", "Title"],
                ["issuer", "Issuer"],
                ["date", "Date"],
              ].map(([key, label]) => (
                <input
                  key={key}
                  placeholder={label}
                  value={(achForm as any)[key]}
                  onChange={(e) => setAchForm({ ...achForm, [key]: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                />
              ))}
              <textarea
                rows={3}
                placeholder="Description"
                value={achForm.description}
                onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              />
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                Add achievement
              </button>
            </form>

            <div className="space-y-2">
              {achievements.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{entry.title}</p>
                    <p className="text-xs text-slate-400">
                      {[entry.issuer, entry.date].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      await adminApi.deleteAchievement(entry.id);
                      await load();
                    }}
                    className="rounded p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="space-y-3">
            {Object.keys(settings).length === 0 && (
              <p className="text-sm text-slate-400">No settings stored yet.</p>
            )}
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{key}</p>
                <div className="flex gap-2">
                  <input
                    value={draftSettings[key] ?? ""}
                    onChange={(e) => setDraftSettings({ ...draftSettings, [key]: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => saveSetting(key)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Save
                  </button>
                </div>
                {draftSettings[key] !== value && (
                  <p className="mt-1 text-[11px] text-amber-300">Unsaved change</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {preview && (
        <Lightbox
          images={preview.images}
          initialIndex={preview.index}
          title="Project images"
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
