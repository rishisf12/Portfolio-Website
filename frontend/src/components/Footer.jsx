import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PORTFOLIO_CONFIG } from '../config/portfolio';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-30 w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center ${
          showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)'
        }}
        aria-label="Back to top"
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 40px rgba(139, 92, 246, 0.5)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.3)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <footer className="relative bg-black/50 backdrop-blur-sm border-t border-white/10 py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span 
                className="text-2xl font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #8B5CF6)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 6s ease infinite'
                }}
              >
                RS
              </span>
              <span className="text-gray-600 text-2xl">·</span>
              <span className="text-gray-400 font-light">Rishikesh Saroj</span>
            </div>

            <div className="flex space-x-6">
              <a 
                href={PORTFOLIO_CONFIG.social.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors duration-300 text-sm"
              >
                Privacy
              </a>
              <a 
                href={PORTFOLIO_CONFIG.social.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors duration-300 text-sm"
              >
                Terms
              </a>
              <button
                onClick={scrollToContact}
                className="text-gray-500 hover:text-white transition-colors duration-300 text-sm cursor-pointer bg-transparent border-none p-0"
              >
                Contact
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} {PORTFOLIO_CONFIG.name}. Crafted with passion.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
};

export default Footer;