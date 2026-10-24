import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Education from "../components/sections/Education";
import Achievements from "../components/sections/Achievements";
import Contact from "../components/sections/Contact";
import ProjectGrid from "../components/projects/ProjectGrid";
import { Code2, Wrench } from "lucide-react";

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-slate-950 text-slate-100">
      <Hero />
      <About />
      <Education />
      <Achievements />

      <div id="technical" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
              <Code2 size={14} /> Section 01
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Technical</h2>
            <p className="text-slate-400">AI/ML, software and deep learning projects.</p>
          </div>
          <ProjectGrid categorySlug="technical" sectionTitle="Technical" />
        </div>
      </div>

      <div id="mechanical" className="py-20 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
              <Wrench size={14} /> Section 02
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Mechanical</h2>
            <p className="text-slate-400">Robotics, CAD, thermodynamics and engineering work.</p>
          </div>
          <ProjectGrid categorySlug="mechanical" sectionTitle="Mechanical" />
        </div>
      </div>

      <Contact />
    </div>
  );
}
