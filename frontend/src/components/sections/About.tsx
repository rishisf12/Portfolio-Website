import { useEffect, useState } from "react";
import { publicApi } from "../../lib/api";
import { groupByDomain, isTechnicalDomain, type SkillLike } from "../../lib/skills";

type Skill = SkillLike;

const FALLBACK: Skill[] = [
  { name: "Python", level: "Advanced", domain: "Languages", category: "Technical" },
  { name: "React", level: "Intermediate", domain: "Frontend", category: "Technical" },
  { name: "FastAPI", level: "Advanced", domain: "Backend", category: "Technical" },
  { name: "Full Stack", level: "Advanced", domain: "Full Stack", category: "Technical" },
  { name: "Progressive Web App (PWA)", level: "Intermediate", domain: "Full Stack", category: "Technical" },
  { name: "PostgreSQL", level: "Advanced", domain: "Databases", category: "Technical" },
  { name: "TensorFlow", level: "Advanced", domain: "Machine Learning", category: "Technical" },
  { name: "AI / ML", level: "Advanced", domain: "Machine Learning", category: "Technical" },
  { name: "Generative AI", level: "Intermediate", domain: "Machine Learning", category: "Technical" },
  { name: "Deep Learning", level: "Advanced", domain: "Deep Learning", category: "Technical" },
  { name: "ANN / CNN / RNN", level: "Advanced", domain: "Deep Learning", category: "Technical" },
  { name: "CAD", level: "Intermediate", domain: "Design", category: "Mechanical" },
  { name: "Thermodynamics", level: "Intermediate", domain: "Mechanical Engineering", category: "Mechanical" },
  { name: "Robotics", level: "Intermediate", domain: "Mechanical Engineering", category: "Mechanical" },
];

export default function About() {
  const [skills, setSkills] = useState<Skill[]>(FALLBACK);
  const [about, setAbout] = useState("");
  const [photo, setPhoto] = useState("/profile.jpg");
  const [photoFailed, setPhotoFailed] = useState(false);
  const [identity, setIdentity] = useState({
    name: "Rishikesh Saroj",
    role: "AI/ML & GenAI Enthusiast",
  });

  useEffect(() => {
    publicApi
      .skills()
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) setSkills(res.data);
      })
      .catch(() => undefined);

    publicApi
      .settings()
      .then((res) => {
        const data = res.data || {};
        setAbout(data.about || "");
        setPhoto(data.profile_image || "/profile.jpg");
        setIdentity({
          name: data.full_name || "Rishikesh Saroj",
          role: data.headline || "AI/ML & GenAI Enthusiast",
        });
      })
      .catch(() => undefined);
  }, []);

  const groups = groupByDomain(skills);

  return (
    <section id="about" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full border border-slate-800 bg-slate-900 ring-2 ring-blue-500/30 ring-offset-4 ring-offset-slate-950">
            {photoFailed ? (
              <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-violet-600 text-2xl font-extrabold text-white">
                RS
              </span>
            ) : (
              <img
                src={photo}
                alt={identity.name}
                onError={() => setPhotoFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <p className="text-xl font-bold text-white">{identity.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
            {identity.role}
          </p>

          <h2 className="mt-8 text-3xl md:text-4xl font-bold text-white mb-4">About Me</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {about ||
              "Mechanical engineering student with a deep passion for Artificial Intelligence, Machine Learning and Generative AI. I enjoy building intelligent systems that bridge the gap between physical engineering and digital innovation."}
          </p>
        </div>

        <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-slate-700/70 to-transparent" />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Education</h3>
            <p className="text-white font-semibold">PDPM IIITDM Jabalpur</p>
            <p className="text-sm text-slate-400 mt-1">B.Tech Mechanical Engineering</p>
            <p className="text-sm text-slate-500 mt-1">2022 – 2026 · CGPA 8.5+</p>
          </div>

          <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Skills</h3>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {groups.map(({ domain, skills: domainSkills }) => {
                const technical = isTechnicalDomain(domain);
                return (
                  <div key={domain}>
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                        technical ? "text-blue-300" : "text-emerald-300"
                      }`}
                    >
                      {domain}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {domainSkills.map((skill, idx) => (
                        <span
                          key={skill.id ?? `${domain}-${idx}`}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                            technical
                              ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
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
          </div>
        </div>
      </div>
    </section>
  );
}
