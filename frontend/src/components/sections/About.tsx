export default function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">About Me</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Mechanical engineering student with a deep passion for Artificial Intelligence,
            Machine Learning, and Generative AI. I enjoy building intelligent systems that
            bridge the gap between physical engineering and digital innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Education</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">PDPM IIITDM Jabalpur</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">B.Tech Mechanical Engineering</p>
          </div>

          <div className="bg-slate-50 dark:bg:sblank-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded border border-blue-200 dark:border-blue-800">TensorFlow</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded border border-blue-200 dark:border-blue-800">ANN / CNN / RNN</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded border border-blue-200 dark:border-blue-800">AI/ML</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded border border-blue-200 dark:border-blue-800">GenAI</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded border border-blue-200 dark:border-blue-800">Deep Learning</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Hobby</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Playing Badminton</p>
          </div>
        </div>
      </div>
    </section>
  );
}