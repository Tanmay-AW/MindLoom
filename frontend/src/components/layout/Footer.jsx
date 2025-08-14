import React from 'react';
import { Linkedin, Github } from 'lucide-react';

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor">
    <path d="M461.2 32H365.3L256 196.6 146.7 32H50.8l146 210.6L38.4 480h96.9L256 314.9 376.7 480h96.9L329.2 242.6z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-8">
        <h3 className="text-2xl font-semibold text-white mb-2 text-center">About MindLoom</h3>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl text-center">
          MindLoom is your personal mental fitness coach—built for students, creators, and professionals
          who want to build mental clarity and resilience in just 5 minutes a day.
          We’re on a mission to make mental strength a daily habit.
        </p>
        <div className="flex justify-center gap-8 mt-4">
          <a href="https://www.linkedin.com/in/tanmaygunwantdev" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors duration-300" target="_blank" rel="noopener noreferrer">
            <Linkedin size={24} />
          </a>
          <a href="https://github.com/Tanmay-AW/MindLoom.git" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors duration-300" target="_blank" rel="noopener noreferrer">
            <Github size={24} />
          </a>
          <a href="https://x.com/tanmay_gunwant" aria-label="X (formerly Twitter)" className="text-gray-400 hover:text-white transition-colors duration-300" target="_blank" rel="noopener noreferrer">
            <XIcon />
          </a>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/10 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} MindLoom: Because screaming into a pillow isn’t scalable.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
