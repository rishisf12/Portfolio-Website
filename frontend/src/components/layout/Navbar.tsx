import { Link, useLocation } from "react-router-dom";
import { Menu, X, Github, LinkedIn, Twitter, Mail, MenuIcon } from "lucide-react";
import { useState } from "react";

export default function Navbar({ user }: { user: { username: string } | null }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#technical", label: "Technical" },
    { href: "/#mechanical", label: "Mechanical" },
    { href: "/#projects", label: "Projects" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">RS</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Portfolio</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href))
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin/login" className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-600 dark:border-slate-400 text-slate-600 dark:text-slate-400 hover:bg-slate-600 dark:hover:bg-slate-400 hover:text-white transition">
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-600 dark:text-slate-400" onClick={() => setOpen(!open)}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-semibold text-center rounded-lg border border-slate-600 dark:border-slate-400 text-slate-600 dark:text-slate-400 hover:bg-slate-600 dark:hover:bg-slate-400 hover:text-white transition"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}