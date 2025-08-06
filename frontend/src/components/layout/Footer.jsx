import React from 'react';
import { Linkedin, Github } from 'lucide-react';

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="20"
    height="20"
    fill="currentColor"
  >
    <path d="M461.2 32H365.3L256 196.6 146.7 32H50.8l146 210.6L38.4 480h96.9L256 314.9 376.7 480h96.9L329.2 242.6z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#1E1E1E] text-gray-300">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">

        {/* About Section */}
        <h3 className="text-xl font-semibold text-white mb-4">About MindLoom</h3>
        <p className="text-base text-gray-400 leading-relaxed">
          MindLoom is your personal mental fitness coach—built for students, creators, and professionals
          who want to build mental clarity and resilience in just 5 minutes a day.
          We’re on a mission to make mental strength a daily habit.
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-8">
          <a
            href="https://www.linkedin.com/in/tanmaygunwantdev"
            aria-label="LinkedIn"
            className="text-gray-400 hover:text-white transition-colors duration-300"
            target="_blank" rel="noopener noreferrer"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://github.com/Tanmay-AW/MindLoom.git"
            aria-label="GitHub"
            className="text-gray-400 hover:text-white transition-colors duration-300"
            target="_blank" rel="noopener noreferrer"
          >
            <Github size={20} />
          </a>
          <a
            href="https://x.com/tanmay_gunwant"
            aria-label="X (formerly Twitter)"
            className="text-gray-400 hover:text-white transition-colors duration-300"
            target="_blank" rel="noopener noreferrer"
          >
            <XIcon />
          </a>
        </div>

        {/* Bottom Line */}
        <div className="mt-16 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MindLoom: Because screaming into a pillow isn’t scalable.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
