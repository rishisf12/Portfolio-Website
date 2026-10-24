import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/90 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-[11px] font-extrabold text-white">
            RS
          </span>
          <span className="text-sm font-bold tracking-tight text-white">Rishikesh Saroj</span>
        </Link>

        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-400"
        >
          <Shield size={12} /> Admin
        </Link>
      </div>
    </header>
  );
}
