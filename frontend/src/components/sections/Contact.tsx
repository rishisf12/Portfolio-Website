import { useEffect, useState } from "react";
import { Mail, Send } from "lucide-react";
import { publicApi } from "../../lib/api";

const DEFAULT_EMAIL = "rishisf12@gmail.com";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState(DEFAULT_EMAIL);

  useEffect(() => {
    publicApi
      .settings()
      .then((res) => {
        if (res.data?.email) setEmail(res.data.email);
      })
      .catch(() => undefined);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || "visitor"}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
            <Mail size={14} /> Contact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-lg text-slate-400">
            Have a project idea or want to collaborate? I'm always open to interesting conversations.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setSent(false); }}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setSent(false); }}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => { setForm({ ...form, message: e.target.value }); setSent(false); }}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition resize-none"
              placeholder="Your message"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-semibold transition shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
          >
            <Send size={17} /> Send Message
          </button>
          {sent && (
            <p className="text-sm text-emerald-400 text-center">
              Your mail app should open with the message ready to send.
            </p>
          )}
          <p className="text-xs text-slate-500 text-center">
            Or email directly:{" "}
            <a href={`mailto:${email}`} className="text-blue-400 hover:underline">
              {email}
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
