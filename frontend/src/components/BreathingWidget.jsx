// src/components/BreathingWidget.js
import React, { useEffect, useState } from "react";

const BreathingWidget = () => {
  const [phase, setPhase] = useState("Inhale");

  useEffect(() => {
    const sequence = ["Inhale", "Hold", "Exhale", "Hold"];
    let i = 0;

    const interval = setInterval(() => {
      setPhase(sequence[i]);
      i = (i + 1) % sequence.length;
    }, 4000); // Change phase every 4s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow rounded-xl p-6 text-center">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">🧘‍♂️ Breathing Exercise</h3>
      <div className="relative w-32 h-32">
        <div
          className={`absolute inset-0 rounded-full bg-blue-300 opacity-70 animate-pulse duration-[4000ms] ${
            phase === "Inhale"
              ? "scale-110"
              : phase === "Exhale"
              ? "scale-90"
              : "scale-100"
          } transition-transform ease-in-out`}
        ></div>
      </div>
      <p className="mt-4 text-md font-medium text-gray-700">{phase}</p>
    </div>
  );
};

export default BreathingWidget;
