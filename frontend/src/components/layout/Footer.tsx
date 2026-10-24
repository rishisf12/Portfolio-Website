import { Github, Linkedin, Twitter, Mail, ArrowUpRight, ArrowRight, MapPin } from "lucide-react";

const EMAIL = "rishisf12@gmail.com";

const explore = [
  { label: "Home", href: "/#top" },
  { label: "Technical", href: "/#technical" },
  { label: "Mechanical", href: "/#mechanical" },
  { label: "Contact", href: "/#contact" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/rishisf12", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/rishisf12", icon: Linkedin },
  { label: "Twitter", href: "https://twitter.com/rishisf12", icon: Twitter },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="relative overflow-hidden border-b border-slate-900">
        <div className="pointer-events-none absolute -top-32 right-0 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Let&apos;s work together</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-white">
              Have a project in mind?
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              Open to internships, collaborations and interesting engineering problems.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <a
              href="/#technical"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:from-blue-500 hover:to-indigo-500"
            >
              <ArrowRight size={18} /> View My Work
            </a>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-7 py-3 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              <Mail size={18} /> Contact Me
            </a>
            <div className="flex items-center gap-3 sm:ml-2">
              <a
                href="https://github.com/rishisf12"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="rounded-lg border border-slate-800 p-2.5 text-slate-400 transition hover:border-slate-600 hover:text-white"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com/in/rishisf12"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="rounded-lg border border-slate-800 p-2.5 text-slate-400 transition hover:border-slate-600 hover:text-white"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/#top" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-extrabold text-white">
                RS
              </span>
              <span>
                <span className="block text-sm font-bold text-white">Rishikesh Saroj</span>
                <span className="block text-xs text-slate-500">AI/ML &amp; GenAI Enthusiast</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Building intelligent systems at the intersection of mechanical engineering and AI.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-lg border border-slate-800 p-2 text-slate-400 transition hover:border-slate-600 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {explore.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-500 transition hover:text-blue-400">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Connect</h3>
            <ul className="mt-4 space-y-2.5">
              {socials.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-blue-400"
                  >
                    {label} <ArrowUpRight size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 text-slate-500 transition hover:text-blue-400"
                >
                  <Mail size={14} /> {EMAIL}
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-slate-500">
                <MapPin size={14} /> Jabalpur, India
              </li>
              <li>
                <a href="/admin" className="text-slate-500 transition hover:text-blue-400">
                  Admin dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-900 pt-6 sm:flex-row">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Rishikesh Saroj. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">Built with React, FastAPI &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
