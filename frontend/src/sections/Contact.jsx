import React, { useState, useEffect, useRef } from 'react';
import { contactAPI } from '../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [focused, setFocused] = useState({
    name: false,
    email: false,
    message: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const sectionRef = useRef(null);

  const socialLinks = [
    { name: 'GitHub', icon: '🐙', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'YouTube', icon: '📺', url: '#' },
    { name: 'Instagram', icon: '📸', url: '#' },
    { name: 'Discord', icon: '💬', url: '#' }
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (field) => {
    setFocused({
      ...focused,
      [field]: true
    });
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      setFocused({
        ...focused,
        [field]: false
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await contactAPI.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setFocused({ name: false, email: false, message: false });
      
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error submitting contact:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-2">
            Get In <span 
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
              Touch
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h3 className="text-2xl font-bold text-white mb-6">Connect With Me</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="group relative p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div className="text-4xl mb-2">{social.icon}</div>
                  <div className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
                    {social.name}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitted && (
                <div 
                  className="p-4 rounded-lg text-green-400 border border-green-500/30 text-center animate-pulse"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)'
                  }}
                >
                  ✅ Message sent successfully!
                </div>
              )}

              {error && (
                <div 
                  className="p-4 rounded-lg text-red-400 border border-red-500/30 text-center"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)'
                  }}
                >
                  ❌ {error}
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  required
                  className="w-full px-4 py-3 bg-transparent rounded-lg text-white border transition-all duration-300 outline-none"
                  style={{
                    borderColor: focused.name ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: focused.name ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                />
                <label
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focused.name || formData.name
                      ? 'text-xs -top-2.5 bg-black px-2 text-purple-400'
                      : 'text-gray-400 top-3'
                  }`}
                >
                  Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  required
                  className="w-full px-4 py-3 bg-transparent rounded-lg text-white border transition-all duration-300 outline-none"
                  style={{
                    borderColor: focused.email ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: focused.email ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                />
                <label
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focused.email || formData.email
                      ? 'text-xs -top-2.5 bg-black px-2 text-purple-400'
                      : 'text-gray-400 top-3'
                  }`}
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  onBlur={() => handleBlur('message')}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-transparent rounded-lg text-white border transition-all duration-300 outline-none resize-none"
                  style={{
                    borderColor: focused.message ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: focused.message ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                />
                <label
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focused.message || formData.message
                      ? 'text-xs -top-2.5 bg-black px-2 text-purple-400'
                      : 'text-gray-400 top-3'
                  }`}
                >
                  Message
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(139, 92, 246, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.3)';
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
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

export default Contact;