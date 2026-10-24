import { useEffect, useState } from "react";
import { publicApi } from "../../lib/api";
import { Award } from "lucide-react";

type Achievement = {
  id?: number;
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
};

const FALLBACK: Achievement[] = [
  {
    title: "AI/ML Enthusiast",
    issuer: "Self-Taught",
    date: "2024",
    description: "Deep learning with TensorFlow, ANN, CNN and RNN architectures.",
  },
  {
    title: "Mechanical Engineering",
    issuer: "PDPM IIITDM Jabalpur",
    date: "2022 - 2026",
    description: "B.Tech program with focus on robotics and automation.",
  },
];

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(FALLBACK);

  useEffect(() => {
    publicApi
      .achievements()
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) setAchievements(res.data);
      })
      .catch(() => undefined);
  }, []);

  return (
    <section id="achievements" className="py-20 bg-slate-900/40 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-3">
            <Award size={14} /> Highlights
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Achievements</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, idx) => (
            <div
              key={item.id ?? idx}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-6 hover:border-violet-500/40 transition"
            >
              <div className="w-11 h-11 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                <Award size={20} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
              {item.issuer && <p className="text-sm text-blue-400">{item.issuer}</p>}
              {item.date && <p className="text-xs text-slate-500 mt-1">{item.date}</p>}
              {item.description && (
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
