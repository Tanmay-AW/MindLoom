import React, { useState, useEffect } from 'react';

const BreathingWidget = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [text, setText] = useState('Tap to Begin');

  useEffect(() => {
    let timer;
    if (isBreathing) {
      // Breathing Cycle: 4s inhale, 4s hold, 6s exhale
      const cycle = () => {
        setText('Inhale...');
        setTimeout(() => {
          setText('Hold...');
          setTimeout(() => {
            setText('Exhale...');
          }, 4000); // Hold duration
        }, 4000); // Inhale duration
      };
      
      cycle(); // Start the first cycle immediately
      timer = setInterval(cycle, 14000); // Total cycle time: 4+4+6 = 14s
    } else {
      setText('Tap to Begin');
    }

    // Cleanup function to clear the interval when the component unmounts or breathing stops
    return () => clearInterval(timer);
  }, [isBreathing]);

  return (
    <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8">
      <div 
        onClick={() => setIsBreathing(!isBreathing)}
        className="w-48 h-48 rounded-full flex items-center justify-center cursor-pointer transition-all duration-[4000ms] ease-in-out"
        style={{
          background: isBreathing ? 'radial-gradient(circle, #A8DADC, #457B9D)' : 'radial-gradient(circle, #D3D3D3, #A9A9A9)',
          transform: isBreathing && (text === 'Inhale...' || text === 'Hold...') ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        <span className="text-white text-2xl font-semibold text-center select-none">{text}</span>
      </div>
      <p className="mt-4 text-primary-text text-opacity-70">A moment of calm is just a breath away.</p>
    </div>
  );
};

export default BreathingWidget;
