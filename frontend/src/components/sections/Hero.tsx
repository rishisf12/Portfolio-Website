import { Link } from "react-router-dom";
import { Mail, ArrowRight, Play, GitHub } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/30 dark:from-black dark:via-black/80 dark:to-black/60"></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
          AI/ML & GenAI Enthusiast
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Rishikesh Saroj
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          B.Tech Mechanical Engineering student at{" "}
          <span className="text-blue-400 font-semibold">PDPM IIITDM Jabalpur</span>. Building
          intelligent systems at the intersection of mechanical engineering and AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="#projects" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <ArrowRight size={18} /> View My Work
          </Link>
          <Link to="#contact" className="px-8 py-3 border border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg font-semibold text-lg transition">
            <Mail size={18} className="mr-2" /> Contact Me
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-1 h-8 bg-slate-600 dark:bg-slate-700 rounded-full mx-auto"></div>
      </div>
    </section>
  );
}