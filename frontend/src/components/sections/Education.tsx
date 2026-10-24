import { useEffect, useState } from "react";
import { publicApi } from "../../lib/api";
import { GraduationCap } from "lucide-react";

type EducationEntry = {
  id?: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  coursework?: string;
};

const FALLBACK: EducationEntry[] = [
  {
    institution: "PDPM IIITDM Jabalpur",
    degree: "B.Tech Mechanical Engineering",
    field_of_study: "Mechanical Engineering",
    start_date: "2022",
    end_date: "2026",
    grade: "CGPA: 8.5+",
    coursework: "AI/ML, Deep Learning, Thermodynamics, Robotics, CAD",
  },
];

export default function Education() {
  const [education, setEducation] = useState<EducationEntry[]>(FALLBACK);

  useEffect(() => {
    publicApi
      .education()
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) setEducation(res.data);
      })
      .catch(() => undefined);
  }, []);

  return (
    <section id="education" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
            <GraduationCap size={14} /> Academic background
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Education</h2>
        </div>

        <div className="space-y-8">
          {education.map((edu, idx) => (
            <div key={edu.id ?? idx} className="relative pl-8">
              <div className="absolute left-0 top-6 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/15" />
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                  <span className="text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-1 rounded">
                    {[edu.start_date, edu.end_date].filter(Boolean).join(" – ")}
                  </span>
                </div>
                <p className="text-blue-400 font-medium">{edu.institution}</p>
                {edu.field_of_study && <p className="text-sm text-slate-400 mt-1">{edu.field_of_study}</p>}
                {edu.grade && <p className="text-sm text-slate-300 mt-3 font-medium">{edu.grade}</p>}
                {edu.coursework && <p className="text-sm text-slate-400 mt-2">{edu.coursework}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
