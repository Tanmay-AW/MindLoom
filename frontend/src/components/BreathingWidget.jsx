import React, { useEffect, useRef, useState } from 'react';

const BreathingWidget = ({ onComplete }) => {
  const [phase, setPhase] = useState('Tap to Begin');
  const [started, setStarted] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [showFinish, setShowFinish] = useState(false);

  const intervalRef = useRef(null);
  const iRef = useRef(0);
  const countRef = useRef(0);

  const phases = ['Inhale', 'Hold', 'Exhale', 'Hold'];

  const startBreathing = () => {
    if (started) return;
    setStarted(true);
    setPhase(phases[0]);

    intervalRef.current = setInterval(() => {
      iRef.current = (iRef.current + 1) % phases.length;
      setPhase(phases[iRef.current]);

      if (iRef.current === 0) {
        countRef.current += 1;
        setCycleCount(countRef.current);

        if (countRef.current >= 3) {
          clearInterval(intervalRef.current);
          setShowFinish(true); // user must now press finish
        }
      }
    }, 4000);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleFinish = () => {
    if (onComplete) onComplete();
    // Optional: Reset or navigate
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow rounded-xl p-6 text-center">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">🧘‍♂️ Breathing Exercise</h3>

      <div
        className="relative w-32 h-32 cursor-pointer"
        onClick={startBreathing}
      >
        <div
          className={`absolute inset-0 rounded-full bg-blue-300 opacity-70 transition-transform duration-[4000ms] ease-in-out
            ${phase === 'Inhale' ? 'scale-110' : phase === 'Exhale' ? 'scale-90' : 'scale-100'}
          `}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xl">{phase}</span>
        </div>
      </div>

      {!started && (
        <p className="mt-4 text-sm text-gray-500">A moment of calm is just a breath away.</p>
      )}

      {showFinish && (
        <button
          onClick={handleFinish}
          className="mt-4 bg-green-600 text-white py-2 px-5 rounded-md font-semibold hover:bg-green-700"
        >
          Finish Breathing
        </button>
      )}
    </div>
  );
};

export default BreathingWidget;
