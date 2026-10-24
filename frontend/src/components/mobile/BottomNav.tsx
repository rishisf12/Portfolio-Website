import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Code2, Home, Mail, Wrench } from "lucide-react";

const tabs = [
  { id: "top", label: "Home", icon: Home },
  { id: "technical", label: "Technical", icon: Code2 },
  { id: "mechanical", label: "Mechanical", icon: Wrench },
  { id: "contact", label: "Contact", icon: Mail },
];

const ids = tabs.map((tab) => tab.id);

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === "/";
  const [active, setActive] = useState("top");

  useEffect(() => {
    if (!onHome) {
      setActive("top");
      return;
    }

    const onScroll = () => {
      const marker = window.scrollY + 160;
      let current = "top";
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  const go = (id: string) => {
    if (onHome) {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", id === "top" ? "/" : `#${id}`);
      setActive(id);
      return;
    }

    navigate("/");
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-4">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => go(id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition ${
                isActive ? "text-blue-400" : "text-slate-500 active:text-slate-300"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 h-0.5 w-7 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
