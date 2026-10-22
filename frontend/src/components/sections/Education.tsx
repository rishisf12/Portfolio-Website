export default function Education() {
  const education = [
    {
      institution: "PDPM IIITDM Jabalpur",
      degree: "B.Tech Mechanical Engineering",
      field: "Mechanical Engineering",
      duration: "2022 - 2026",
      grade: "CGPA: 8.5+",
      coursework: "AI/ML, Deep Learning, Thermodynamics, Robotics, CAD",
    },
  ];

  return (
    <section id="education" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Education</h2>
        </div>

        <div className="space-y-12">
          {education.map((edu, idx) => (
            <div key={idx} className="relative pl-8">
              <div className="absolute -left-2.5 top-3 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900"></div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{edu.degree}</h3>
                  <span className="text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                    {edu.duration}
                  </span>
                </div>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-1">{edu.institution}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{edu.field}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">{edu.coursework}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}