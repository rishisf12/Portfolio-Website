import React, { useEffect, useRef } from 'react';

const About = () => {
  const sectionRef = useRef(null);

  const skills = [
    { name: 'ReactJs with Vite', color: 'from-blue-500 to-cyan-400' },
    { name: 'TailwindCss', color: 'from-green-500 to-emerald-400' },
    { name: 'Python', color: 'from-blue-600 to-indigo-400' },
    { name: 'FastAPI', color: 'from-green-600 to-lime-400' },
    { name: 'SQLModel', color: 'from-yellow-500 to-orange-400' },
    { name: 'Docker', color: 'from-blue-400 to-sky-300' },
    
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const elements = entry.target.querySelectorAll('.animate-on-scroll');
          elements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('opacity-100', 'translate-y-0');
            }, index * 100);
          });
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-2">
                About <span 
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
                  Me
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>

            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <p className="text-gray-300 leading-relaxed">
                I'm a passionate <span className="text-purple-400 font-semibold">Full Stack Developer</span> 
                with expertise in building modern web applications. With a strong foundation in 
                <span className="text-pink-400 font-semibold"> Python</span> .
                I specialize in creating responsive, performant, and visually stunning user interfaces.
              </p>
            </div>

            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <p className="text-gray-300 leading-relaxed">
                I believe in writing clean, maintainable code and continuously learning new technologies. 
                Currently exploring <span className="text-blue-400 font-semibold">Machine Learning and DeepLearing</span>  to expand my skill set.
              </p>
            </div>

            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 pt-4">
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={skill.name}
                    className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${skill.color} bg-opacity-20 text-white border border-white/10 transition-all duration-300 hover:scale-105`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.1)';
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 relative group">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
              ></div>
              <div 
                className="relative w-72 h-96 rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-105"
                style={{
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm">
                  <div className="text-center text-gray-400">
                    <svg className="w-24 h-24 mx-auto mb-4 text-purple-500/50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    <span className="text-sm">Profile Image</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default About;