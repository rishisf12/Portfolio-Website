export default function Technical() {
  return (
    <section id="technical" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">⚡</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Technical Projects</h2>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300">AI/ML, Software Development, and Technical Innovations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="project-grid-technical">
          {/* Projects injected via ProjectGrid */}
          <div className="col-span-3 text-center py-10 text-slate-500 dark:text-slate-400">
            Loading technical projects...
          </div>
        </div>
      </div>
    </section>
  );
}