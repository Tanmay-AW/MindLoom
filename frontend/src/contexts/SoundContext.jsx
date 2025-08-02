import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';

const SoundContext = createContext();

const soundGenerators = {
  Rain: () => new Tone.Noise("pink").connect(new Tone.Filter(800, "lowpass")).toDestination(),
  Wind: () => new Tone.Noise("brown").connect(new Tone.Filter(500, "lowpass")).toDestination(),
  Ocean: () => new Tone.Noise("white").connect(new Tone.AutoFilter("4n").start()).toDestination(),
  Fire: () => new Tone.Noise("brown").connect(new Tone.AutoFilter({ frequency: "8n", baseFrequency: 400, octaves: 2 })).toDestination(),
};
const soundList = Object.keys(soundGenerators);

export const SoundProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [volume, setVolume] = useState(50); // Volume from 0 to 100
  const [isBarVisible, setIsBarVisible] = useState(true); // NEW: Tracks if the main sound bar is on screen
  
  const playerRef = useRef(null);

  // Update master volume whenever the volume state changes
  useEffect(() => {
    // Tone.js uses decibels. We convert our 0-100 scale.
    // A value of 0 is -Infinity dB (silent).
    if (volume === 0) {
      Tone.Destination.volume.value = -Infinity;
    } else {
      // This formula converts a linear 0-100 scale to a more natural-sounding logarithmic scale
      Tone.Destination.volume.value = (volume - 100) / 2;
    }
  }, [volume]);

  const playSound = async (soundName) => {
    await Tone.start();
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.dispose();
    }
    if (soundGenerators[soundName]) {
      const newPlayer = soundGenerators[soundName]();
      newPlayer.start();
      playerRef.current = newPlayer;
      setCurrentSound(soundName);
      setIsPlaying(true);
    }
  };

  const pauseSound = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.dispose();
      playerRef.current = null;
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseSound();
    } else if (currentSound) {
      playSound(currentSound); // Resume the same sound
    }
  };

  const playNext = () => {
    if (!currentSound) return;
    const currentIndex = soundList.indexOf(currentSound);
    const nextIndex = (currentIndex + 1) % soundList.length; // Loop back to the start
    playSound(soundList[nextIndex]);
  };

  const playPrev = () => {
    if (!currentSound) return;
    const currentIndex = soundList.indexOf(currentSound);
    const prevIndex = (currentIndex - 1 + soundList.length) % soundList.length; // Loop back to the end
    playSound(soundList[prevIndex]);
  };

  const value = {
    sounds: soundList,
    currentSound,
    isPlaying,
    volume,
    isBarVisible, // Expose the visibility state
    setVolume,
    setIsBarVisible, // Expose the setter for the observer
    playSound,
    pauseSound,
    togglePlay,
    playNext,
    playPrev,
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  return useContext(SoundContext);
};
