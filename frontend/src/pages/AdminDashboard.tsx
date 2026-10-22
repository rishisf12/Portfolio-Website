export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">RS</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              View Site
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Projects</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Published</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Skills</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition">
              Add Project
            </button>
            <button className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium transition">
              Manage Projects
            </button>
            <button className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text:sblank-200 rounded-xl text-sm font-medium transition">
              Site Settings
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-500 dark:text-slate-400 py-12">
          Admin panel coming soon. Use the API at <code className="text-blue-600 dark:text-blue-400">/docs</code> to manage content.
        </div>
      </div>
    </div>
  );
}