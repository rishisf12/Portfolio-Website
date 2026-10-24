import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Code2,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Sparkles,
  Wrench,
} from "lucide-react";
import { publicApi } from "../lib/api";
import { groupByDomain, isTechnicalDomain, type SkillLike } from "../lib/skills";
import BottomNav from "../components/mobile/BottomNav";
import MobileHeader from "../components/mobile/MobileHeader";
import MobileProjectCard from "../components/mobile/MobileProjectCard";

type Project = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  tech_stack: string;
  github_url?: string | null;
  category?: { name: string; slug: string };
  images: Array<{ image_url: string }>;
};

type Skill = SkillLike;

type EducationEntry = {
  id?: number;
  institution: string;
  degree: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
};

type Achievement = {
  id?: number;
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
};

const DEFAULTS = {
  full_name: "Rishikesh Saroj",
  headline: "AI/ML & GenAI Enthusiast",
  bio: "B.Tech Mechanical Engineering student at PDPM IIITDM Jabalpur, building intelligent systems at the intersection of mechanical engineering and AI.",
  about:
    "Mechanical engineering student with a deep passion for Artificial Intelligence, Machine Learning and Generative AI. I enjoy building intelligent systems that bridge the gap between physical engineering and digital innovation.",
  email: "rishisf12@gmail.com",
  location: "Jabalpur, India",
};

export default function MobileHome() {
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULTS);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [technical, setTechnical] = useState<Project[]>([]);
  const [mechanical, setMechanical] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    let alive = true;

    Promise.allSettled([
      publicApi.settings(),
      publicApi.skills(),
      publicApi.education(),
      publicApi.achievements(),
      publicApi.projects("technical"),
      publicApi.projects("mechanical"),
    ]).then(([settingsRes, skillsRes, eduRes, achRes, techRes, mechRes]) => {
      if (!alive) return;
      const data = (result: PromiseSettledResult<any>, fallback: any) =>
        result.status === "fulfilled" ? result.value.data : fallback;

      setSettings({ ...DEFAULTS, ...(data(settingsRes, {}) || {}) });
      setSkills(data(skillsRes, []) || []);
      setEducation(data(eduRes, []) || []);
      setAchievements(data(achRes, []) || []);
      setTechnical(data(techRes, []) || []);
      setMechanical(data(mechRes, []) || []);
      setLoading(false);
    });

    return () => {
      alive = false;
    };
  }, []);

  const [firstName, ...rest] = (settings.full_name || DEFAULTS.full_name).split(" ");
  const lastName = rest.join(" ");
  const skillGroups = groupByDomain(skills);
  const email = settings.email || DEFAULTS.email;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || "visitor"}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div
      id="top"
      className="min-h-screen bg-slate-950 text-slate-100"
      style={{ paddingBottom: "calc(4.75rem + env(safe-area-inset-bottom))" }}
    >
      <MobileHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-8 pt-8">
        <div className="pointer-events-none absolute -top-24 right-0 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            {settings.headline || DEFAULTS.headline}
          </span>

          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-white">
            {firstName}{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {lastName}
            </span>
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {settings.bio || DEFAULTS.bio}
          </p>

          <div className="mt-5 flex gap-3">
            <a
              href="#technical"
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 active:from-blue-500 active:to-indigo-500"
            >
              View work <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 text-sm font-semibold text-slate-200 active:bg-slate-900"
            >
              <Mail size={16} /> Contact
            </a>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <a
              href="https://github.com/rishisf12"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-lg border border-slate-800 p-2.5 text-slate-400 active:text-white"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com/in/rishisf12"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-lg border border-slate-800 p-2.5 text-slate-400 active:text-white"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="rounded-lg border border-slate-800 p-2.5 text-slate-400 active:text-white"
            >
              <Mail size={16} />
            </a>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { value: `${technical.length + mechanical.length || 6}+`, label: "Projects" },
              { value: `${skills.length || 12}`, label: "Skills" },
              { value: "8.5+", label: "CGPA" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5">
                <p className="text-lg font-bold leading-none text-white">{item.value}</p>
                <p className="mt-1 text-[10px] text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + skills */}
      <section className="border-t border-slate-900 px-4 py-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
          <Sparkles size={12} /> About
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white">About me</h2>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-800 bg-slate-900 ring-2 ring-blue-500/30 ring-offset-2 ring-offset-slate-950">
            {photoFailed ? (
              <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-extrabold text-white">
                RS
              </span>
            ) : (
              <img
                src={settings.profile_image || "/profile.jpg"}
                alt={settings.full_name || DEFAULTS.full_name}
                onError={() => setPhotoFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {settings.full_name || DEFAULTS.full_name}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-blue-400">
              {settings.headline || DEFAULTS.headline}
            </p>
          </div>
        </div>

        <div className="mt-4 h-px w-full bg-gradient-to-r from-slate-800 via-slate-700/70 to-transparent" />

        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          {settings.about || DEFAULTS.about}
        </p>

        <div className="mt-4 grid gap-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Education</p>
            <p className="mt-1 text-sm font-semibold text-white">PDPM IIITDM Jabalpur</p>
            <p className="text-xs text-slate-500">B.Tech Mechanical Engineering · 2022–2026</p>
          </div>

          {skillGroups.map(({ domain, skills: domainSkills }) => {
            const technical = isTechnicalDomain(domain);
            return (
              <div key={domain} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <p
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    technical ? "text-blue-300" : "text-emerald-300"
                  }`}
                >
                  {domain}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {domainSkills.map((skill, index) => (
                    <span
                      key={skill.id ?? `${domain}-${index}`}
                      className={`rounded-md border px-2 py-1 text-[11px] font-medium ${
                        technical
                          ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Projects */}
      <section id="technical" className="border-t border-slate-900 px-4 py-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
          <Code2 size={12} /> Section 01
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white">Technical</h2>
        <p className="mt-1 text-sm text-slate-500">AI/ML, software and deep learning projects.</p>

        <div className="mt-5 space-y-4">
          {loading && (
            <>
              <div className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50" />
              <div className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50" />
            </>
          )}
          {!loading &&
            technical.map((project) => <MobileProjectCard key={project.id} project={project} />)}
          {!loading && technical.length === 0 && (
            <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">
              No technical projects yet. Add them from the{" "}
              <Link to="/admin" className="text-blue-400 underline">
                admin dashboard
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section id="mechanical" className="border-t border-slate-900 px-4 py-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          <Wrench size={12} /> Section 02
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white">Mechanical</h2>
        <p className="mt-1 text-sm text-slate-500">Robotics, CAD and engineering work.</p>

        <div className="mt-5 space-y-4">
          {!loading &&
            mechanical.map((project) => <MobileProjectCard key={project.id} project={project} />)}
          {!loading && mechanical.length === 0 && (
            <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">
              No mechanical projects yet. Add them from the{" "}
              <Link to="/admin" className="text-blue-400 underline">
                admin dashboard
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {/* Education */}
      <section className="border-t border-slate-900 px-4 py-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
          <GraduationCap size={12} /> Academic background
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white">Education</h2>

        <div className="mt-4 space-y-3">
          {education.map((entry, index) => (
            <div key={entry.id ?? index} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-white">{entry.degree}</h3>
                <span className="shrink-0 rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
                  {[entry.start_date, entry.end_date].filter(Boolean).join("–")}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-blue-400">{entry.institution}</p>
              {entry.grade && <p className="mt-1 text-xs text-slate-400">{entry.grade}</p>}
            </div>
          ))}
          {education.length === 0 && (
            <p className="text-sm text-slate-500">Education details coming soon.</p>
          )}
        </div>
      </section>

      {/* Achievements */}
      <section className="border-t border-slate-900 px-4 py-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-400">
          <Award size={12} /> Highlights
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white">Achievements</h2>

        <div className="mt-4 space-y-3">
          {achievements.map((item, index) => (
            <div key={item.id ?? index} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                  <Award size={15} className="text-violet-400" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-[11px] text-slate-500">
                    {[item.issuer, item.date].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
              {item.description && (
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.description}</p>
              )}
            </div>
          ))}
          {achievements.length === 0 && (
            <p className="text-sm text-slate-500">Achievements coming soon.</p>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-slate-900 px-4 py-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
          <Mail size={12} /> Contact
        </span>
        <h2 className="mt-2 text-2xl font-bold text-white">Get in touch</h2>
        <p className="mt-1 text-sm text-slate-500">
          Have an idea or want to collaborate? Send a message.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-300">Name</span>
            <input
              required
              value={form.name}
              onChange={(event) => {
                setForm({ ...form, name: event.target.value });
                setSent(false);
              }}
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-300">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => {
                setForm({ ...form, email: event.target.value });
                setSent(false);
              }}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-300">Message</span>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(event) => {
                setForm({ ...form, message: event.target.value });
                setSent(false);
              }}
              placeholder="Your message"
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-base text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white active:from-blue-500 active:to-indigo-500"
          >
            <Send size={16} /> Send message
          </button>
          {sent && (
            <p className="text-center text-xs text-emerald-400">
              Your mail app should open with the message ready to send.
            </p>
          )}
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <MapPin size={12} /> {settings.location || DEFAULTS.location}
          </p>
        </form>
      </section>

      <footer className="border-t border-slate-900 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-[11px] font-extrabold text-white">
              RS
            </span>
            <span className="text-xs font-semibold text-slate-300">Rishikesh Saroj</span>
          </div>
          <Link to="/admin" className="text-[11px] text-slate-500">
            Admin
          </Link>
        </div>
        <p className="mt-3 text-[11px] text-slate-600">
          © {new Date().getFullYear()} Rishikesh Saroj · Built with React + FastAPI
        </p>
      </footer>

      <BottomNav />
    </div>
  );
}
