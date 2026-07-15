import React, { useEffect, useRef, useState } from 'react';
import { projectsAPI } from '../api/axios';

const Projects = () => {
  const sectionRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.project-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('opacity-100', 'translate-y-0');
            }, index * 100);
          });
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [projects]);

  if (loading) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-2">
            My <span 
              className=""
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #8B5CF6)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 6s ease infinite'
              }}
            >
              Projects
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and expertise.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const tags = Array.isArray(project.tags) ? project.tags : 
                          (project.tags ? project.tags.split(',').filter(t => t.trim()) : []);
              
              return (
                <div
                  key={project.id || index}
                  className="project-card opacity-0 translate-y-10 transition-all duration-700 relative group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div 
                    className="relative rounded-2xl overflow-hidden h-full transition-all duration-500 group-hover:-translate-y-2"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-gray-900">
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title || 'Project'} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-4xl">
                                🚀
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-6xl">
                          🚀
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="absolute top-4 right-4 flex flex-wrap gap-2 max-w-[70%] justify-end">
                      {tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-1 text-xs font-medium rounded-full bg-black/70 text-white border border-white/20 backdrop-blur-sm">
                          {tag.trim()}
                        </span>
                      ))}
                      {tags.length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-black/70 text-white border border-white/20 backdrop-blur-sm">
                          +{tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white truncate">
                          {project.title || 'Untitled Project'}
                        </h3>
                        {project.is_featured && (
                          <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full whitespace-nowrap">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {project.description || 'No description available'}
                      </p>
                      
                      <div className="flex gap-3">
                        <a
                          href={project.live_demo_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                          }}
                        >
                          Live Demo
                        </a>
                        <a
                          href={project.github_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 hover:scale-105"
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '2px solid transparent',
                            backgroundImage: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), linear-gradient(135deg, #8B5CF6, #EC4899)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box'
                          }}
                        >
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default Projects;