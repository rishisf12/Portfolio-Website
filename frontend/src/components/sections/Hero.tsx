import { useEffect, useState } from "react";
import { publicApi } from "../../lib/api";

export default function Hero() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    publicApi
      .settings()
      .then((res) => setSettings(res.data || {}))
      .catch(() => undefined);
  }, []);

  const fullName = settings.full_name || "Rishikesh Saroj";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ");
  const headline = settings.headline || "AI/ML & GenAI Enthusiast";

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.28),_transparent_55%)]" />
      <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-900/70 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          {headline}
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.05]">
          {firstName}{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {lastName}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
          B.Tech Mechanical Engineering student at{" "}
          <span className="text-blue-400 font-semibold">PDPM IIITDM Jabalpur</span>. Building
          intelligent systems at the intersection of mechanical engineering and AI.
        </p>
      </div>
    </section>
  );
}
