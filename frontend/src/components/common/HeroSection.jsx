import React from 'react';
import AmbientSoundBar from '../sound/AmbientSoundBar.jsx';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection = () => {
  const { userInfo } = useAuth();
  return (
    // Added pt-24 for mobile to push content below the navbar, and md:pt-0 to reset on desktop
    <div className="relative min-h-screen flex flex-col justify-center items-center text-white text-center px-6 pt-24 md:pt-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent -z-10" />

      <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4 [text-shadow:0_0_12px_rgba(0,0,0,0.5)]">
        A calmer, stronger mind in 5 minutes a day.
      </h1>
      <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto [text-shadow:0_0_8px_rgba(0,0,0,0.5)]">
        MindLoom helps you build daily mental strength with proactive routines guided by your AI coach, CalmBot.
      </p>
      {!userInfo && (
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <a href="/signup" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg shadow-lg">
            Get Started 
          </a>
        </div>
      )}
      <br /><br />
      <AmbientSoundBar />
    </div>
  );
};

export default HeroSection;
