import { useState } from "react";
import { X, ExternalLink, Github } from "lucide-react";
import ImageCarousel from "./ImageCarousel";

interface ProjectModalProps {
  project: {
    title: string;
    description: string;
    tech_stack: string;
    style_theme: string;
    demo_url?: string;
    github_url?: string;
    images: Array<{ image_url: string; alt_text?: string }>;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!isOpen) return null;

  const techTags = project.tech_stack.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white dark:hover:text-slate-200">
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 block">
                {project.style_theme}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {project.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">{project.description.slice(0, 200)}...</p>
            </div>
            <div className="flex items-center gap-3">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow"
                >
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-slate-600 dark:border-slate-400 text-slate-600 dark:text-slate-400 hover:bg-slate-600 dark:hover:bg-slate-400 hover:text-white rounded-lg text-sm font-medium transition"
                >
                  <Github size={16} /> Source
                </a>
              )}
            </div>
          </div>

          {/* Image Carousel */}
          <div className="mb-8">
            <ImageCarousel images={project.images} />
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {techTags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Full Description */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Description</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}