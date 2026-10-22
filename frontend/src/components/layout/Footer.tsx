import { Github, LinkedIn, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight">RS</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">Portfolio</span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/rishisf12"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/rishisf12"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text:sblank-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <LinkedIn size={20} />
            </a>
            <a
              href="https://twitter.com/rishisf12"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <Twitter size={20} />
            </a>
            <a href="mailto:rishikeshsaroj10@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
              <Mail size={20} />
            </a>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} Rishikesh Saroj. Built with React + FastAPI.
          </p>
        </div>
      </div>
    </footer>
  );
}