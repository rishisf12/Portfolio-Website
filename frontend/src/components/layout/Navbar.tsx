import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar({ user }: { user: { username: string } | null }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const onHome = location.pathname === "/";

  const navLinks = [
    { hash: "", label: "Home" },
    { hash: "technical", label: "Technical" },
    { hash: "mechanical", label: "Mechanical" },
    { hash: "contact", label: "Contact" },
  ];

  const hrefFor = (hash: string) => {
    if (!hash) return onHome ? "#top" : "/";
    return onHome ? `#${hash}` : `/#${hash}`;
  };

  const [scrollHash, setScrollHash] = useState("");

  useEffect(() => {
    if (!onHome) {
      setScrollHash("");
      return;
    }
    const handleScroll = () => {
      const ids = navLinks.map((l) => l.hash || "top");
      let closestId = "";
      let closestDist = Infinity;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - 120);
        if (dist < closestDist) {
          closestDist = dist;
          closestId = id === "top" ? "" : id;
        }
      });
      setScrollHash(closestId);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onHome]);

  const activeHash = onHome ? scrollHash : "";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (!onHome) return;
    e.preventDefault();
    const el = document.getElementById(hash || "top");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", hash ? `#${hash}` : "/");
    }
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href={hrefFor("")} onClick={(e) => scrollToSection(e, "")} className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">RS</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Portfolio</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={hrefFor(link.hash)}
                onClick={(e) => scrollToSection(e, link.hash)}
                className={`text-sm font-medium transition-colors ${
                  activeHash === link.hash
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              to={user ? "/admin" : "/admin/login"}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-600 dark:border-slate-400 text-slate-600 dark:text-slate-400 hover:bg-slate-600 dark:hover:bg-slate-400 hover:text-white transition"
            >
              {user ? "Dashboard" : "Admin"}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle menu"
              className="md:hidden text-slate-600 dark:text-slate-400"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={hrefFor(link.hash)}
                onClick={(e) => scrollToSection(e, link.hash)}
                className="block py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {link.label}
              </a>
            ))}
            <Link
              to={user ? "/admin" : "/admin/login"}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-semibold text-center rounded-lg border border-slate-600 dark:border-slate-400 text-slate-600 dark:text-slate-400 hover:bg-slate-600 dark:hover:bg-slate-400 hover:text-white transition"
            >
              {user ? "Dashboard" : "Admin Login"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
