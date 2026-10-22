export default function Achievements() {
  const achievements = [
    {
      title: "AI/ML Enthusiast",
      issuer: "Self-Taught",
      date: "2024",
      description: "Deep learning with TensorFlow, ANN, CNN, RNN architectures.",
    },
    {
      title: "Mechanical Engineering",
      issuer: "PDPM IIITDM Jabalpur",
      date: "2022 - 2026",
      description: "B.Tech program with focus on robotics and automation.",
    },
  ];

  return (
    <section id="achievements" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Achievements</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold">★</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{ach.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{ach.issuer}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">{ach.date}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}