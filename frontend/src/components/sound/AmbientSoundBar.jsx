import React, { useEffect, useRef } from 'react';
import { useSound } from '../../contexts/SoundContext.jsx';
import { FaCloudRain, FaWind, FaWater, FaFire, FaPlay, FaPause } from 'react-icons/fa';

const soundIcons = { Rain: <FaCloudRain />, Wind: <FaWind />, Ocean: <FaWater />, Fire: <FaFire /> };

// --- NEW: A mapping from sound names to their animation classes ---
const soundAnimations = {
  Rain: 'animate-rain-container',
  Wind: 'animate-sway',
  Ocean: 'animate-wave',
  Fire: 'animate-flicker',
};

const AmbientSoundBar = () => {
  const { sounds, currentSound, isPlaying, volume, setVolume, playSound, pauseSound, togglePlay, setIsBarVisible } = useSound();
  const barRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { setIsBarVisible(entry.isIntersecting); }, { threshold: 0.5 });
    if (barRef.current) observer.observe(barRef.current);
    return () => { if (barRef.current) observer.unobserve(barRef.current); };
  }, [setIsBarVisible]);

  return (
    <div ref={barRef} className="flex flex-col items-center space-y-6 w-full max-w-lg mx-auto">
      {/* Sound Icons Row */}
      <div className="flex justify-center items-center space-x-2 sm:space-x-4 w-full">
        {sounds.map((soundName) => {
          const isActive = isPlaying && currentSound === soundName;
          // Get the animation class for the current sound, or an empty string if not active
          const animationClass = isActive ? soundAnimations[soundName] : '';

          return (
            <button
              key={soundName}
              onClick={() => (isActive ? pauseSound() : playSound(soundName))}
              className={`relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-white border-cta-orange scale-110 shadow-lg' : 'bg-white bg-opacity-20 border-white hover:scale-105 hover:bg-opacity-30'}`}
              title={soundName}
            >
              <span className={`text-2xl sm:text-3xl transition-colors ${isActive ? 'text-cta-orange' : 'text-white'} ${animationClass}`}>
                {soundIcons[soundName]}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Controls Row */}
      <div className="w-full flex items-center space-x-4 bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-full">
        <button onClick={togglePlay} className="text-white text-xl p-2">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full h-2 bg-white bg-opacity-50 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default AmbientSoundBar;
