import React, { useEffect, useRef } from 'react';

const About = () => {
  const sectionRef = useRef(null);

  const skills = [
    { category: 'Languages', items: ['Python (Primary)', 'JavaScript', 'SQL'] },
    { category: 'ML & AI', items: ['Scikit-learn', 'OpenCV', 'Tesseract OCR', 'Hugging Face (LLMs)', 'Pandas', 'NumPy', 'Matplotlib'] },
    { category: 'Backend', items: ['FastAPI', 'REST APIs', 'SQLModel', 'PostgreSQL', 'Alembic', 'Docker', 'pytest'] },
    { category: 'Frontend & Tools', items: ['React', 'Vite', 'Tailwind CSS', 'Recharts', 'Git/GitHub'] },
  ];

  const education = [
    {
      degree: 'B.Tech, Mechanical Engineering',
      institution: 'PDPM IIITDM Jabalpur, Madhya Pradesh',
      year: 'Expected 2028',
      cpi: 'CPI: 6.9'
    },
    {
      degree: 'Class XII',
      institution: '',
      year: '',
      cpi: '80%'
    },
    {
      degree: 'Class X',
      institution: '',
      year: '',
      cpi: '92%'
    }
  ];

  const achievements = [
    {
      title: 'Smart India Hackathon 2026',
      description: 'Team of 6; proposed SkyGuard AI (SIH26073), an Isolation Forest + SHAP anomaly-detection system to separate genuine weather events from sensor faults in Automatic Weather Stations.',
    },
    {
      title: 'Patent (Filed)',
      description: 'Co-inventor, Indian patent application no. 202621096766 A, adjustable hybrid welding device with integrated safety measures.',
    },
    {
      title: 'Jagrati Volunteer',
      description: 'Teach underprivileged village children every evening and help plan the student-run initiative\'s daily activities.',
    }
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
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
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
              <p className="text-gray-300 leading-relaxed mb-4">
                I'm a <span className="text-purple-400 font-semibold">Mechanical Engineering undergraduate</span> at IIITDM Jabalpur 
                who builds <span className="text-pink-400 font-semibold">ML-powered applications end-to-end</span>.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                My stack: <span className="text-blue-400 font-semibold">Scikit-learn</span>, <span className="text-blue-400 font-semibold">OCR + LLM pipelines</span> 
                (Tesseract, Hugging Face), served through <span className="text-green-400 font-semibold">FastAPI</span>, 
                <span className="text-green-400 font-semibold">PostgreSQL</span> & <span className="text-cyan-400 font-semibold">React</span>.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Currently learning <span className="text-orange-400 font-semibold">React Native</span> to bring campus tools to mobile for 1,500+ students. 
                Seeking <span className="text-yellow-400 font-semibold">AI/ML or Software Engineering internship</span> opportunities.
              </p>
            </div>

            {/* Education */}
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <h3 className="text-xl font-bold text-white mb-4">Education</h3>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-white">{edu.degree}</h4>
                        {edu.institution && <p className="text-gray-400 text-sm">{edu.institution}</p>}
                      </div>
                      <div className="text-right">
                        {edu.year && <p className="text-purple-400 text-sm font-medium">{edu.year}</p>}
                        <p className="text-gray-400 text-sm">{edu.cpi}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((ach, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 border-l-4 border-l-purple-500">
                    <h4 className="font-semibold text-white mb-1">{ach.title}</h4>
                    <p className="text-gray-400 text-sm">{ach.description}</p>
                  </div>
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
                    <svg className="w-24 h-24 mx-auto mb-4 text-purple-500/50" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    <span className="text-sm">Profile Image</span>
                    <p className="text-xs text-gray-500 mt-1">Add your photo in About.jsx</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section - Full Width */}
        <div className="mt-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Technical Skills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup, groupIndex) => (
              <div key={skillGroup.category} className="p-6 rounded-2xl bg-white/5 border border-white/10" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                <h4 className="text-purple-400 font-semibold mb-3 border-b border-white/10 pb-2">{skillGroup.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-white/10 transition-all duration-300 hover:scale-105"
                      style={{
                        animationDelay: `${skillIndex * 50}ms`,
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.1)';
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
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