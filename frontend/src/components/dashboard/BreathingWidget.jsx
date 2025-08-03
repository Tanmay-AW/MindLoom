import React, { useState, useEffect, useRef } from 'react';
import API from '../../api';

const BreathingWidget = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [text, setText] = useState('Tap to Begin');
  const [cycles, setCycles] = useState(0);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  const TOTAL_CYCLES = 3;

  // Check the user's status when the component first loads
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await API.get('/breathing/today');
        setHasCompletedToday(data.completed);
      } catch (err) {
        console.error("Failed to check breathing status", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  // Main breathing cycle logic
  useEffect(() => {
    if (isBreathing) {
      const cycle = () => {
        // Use a functional update to get the most recent state
        setCycles(prevCycles => {
          const nextCycle = prevCycles + 1;
          if (nextCycle > TOTAL_CYCLES) {
            setIsBreathing(false);
            
            // Only log the completion if it hasn't been done yet today
            if (!hasCompletedToday) {
              setHasCompletedToday(true);
              API.post('/breathing/log').catch(err => console.error("Failed to log session", err));
            }
            return TOTAL_CYCLES;
          }

          setText('Inhale...');
          setTimeout(() => setText('Hold...'), 4000);
          setTimeout(() => setText('Exhale...'), 8000);
          return nextCycle;
        });
      };
      
      cycle();
      intervalRef.current = setInterval(cycle, 14000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isBreathing, hasCompletedToday]);

  const handleStart = () => {
    setCycles(0);
    setIsBreathing(true);
  };

  if (isLoading) {
    return <div className="text-center p-6 bg-white rounded-lg shadow-md mt-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8">
      <div 
        onClick={() => !isBreathing && handleStart()}
        className="w-48 h-48 rounded-full flex items-center justify-center cursor-pointer transition-all duration-[4000ms] ease-in-out"
        style={{
          background: isBreathing ? 'radial-gradient(circle, #A8DADC, #457B9D)' : 'radial-gradient(circle, #D3D3D3, #A9A9A9)',
          transform: isBreathing && (text === 'Inhale...' || text === 'Hold...') ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        <span className="text-white text-2xl font-semibold text-center select-none">
          {isBreathing ? text : hasCompletedToday ? 'Done!' : 'Tap to Begin'}
        </span>
      </div>
      <p className={`mt-4 text-primary-text text-opacity-70 transition-colors duration-500 ${hasCompletedToday ? 'text-green-600 font-semibold' : ''}`}>
          {hasCompletedToday 
          ? "Nice work! You’ve completed 3 calming cycles."
          : isBreathing 
          ? `Breath ${cycles} of ${TOTAL_CYCLES}` 
          : 'A moment of calm is just a breath away.'
        }
      </p>
    </div>
  );
};

export default BreathingWidget;
