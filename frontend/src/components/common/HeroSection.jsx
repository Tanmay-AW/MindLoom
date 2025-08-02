import React from 'react';
import AmbientSoundBar from '../sound/AmbientSoundBar.jsx';

const HeroSection = () => {
  return (
    // A simple container that fills the screen and centers its content
    <div className="min-h-screen flex flex-col justify-center items-center text-white text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
        A calmer, stronger mind in 5 minutes a day.
      </h1>
      <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">
        MindLoom helps you build daily mental strength with proactive routines guided by your AI coach, CalmBot.
      </p>
      
      {/* The sound bar is now cleanly placed at the bottom */}
      <AmbientSoundBar />
    </div>
  );
};

export default HeroSection;
