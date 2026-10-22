export default function Mechanical() {
  return (
    <section id="mechanical" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center text-lg">🔧</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Mechanical Projects</h2>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300">Robotics, CAD, Thermodynamics, and Mechanical Engineering</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="project-grid-mechanical">
          {/* Projects injected via ProjectGrid */}
          <div className="col-span-3 text-center py-10 text-slate-500 dark:text-slate-400">
            Loading mechanical projects...
          </div>
        </div>
      </div>
    </section>
  );
}