import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Education from "../components/sections/Education";
import Achievements from "../components/sections/Achievements";
import Technical from "../components/sections/Technical";
import Mechanical from "../components/sections/Mechanical";
import Contact from "../components/sections/Contact";
import ProjectGrid from "../components/projects/ProjectGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      <Hero />
      <About />
      <Education />
      <Achievements />
      <div id="technical" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Technical</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">AI/ML, Software, Deep Learning projects.</p>
          </div>
          <ProjectGrid categorySlug="technical" sectionTitle="Technical" />
        </div>
      </div>
      <div id="mechanical" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Mechanical</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">Robotics, CAD, Thermodynamics, Engineering.</p>
          </div>
          <ProjectGrid categorySlug="mechanical" sectionTitle="Mechanical" />
        </div>
      </div>
      <Contact />
    </div>
  );
}