import React from 'react';

// A simple card component for our layout
const InfoCard = ({ icon, title, children }) => (
  <div className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);

const HowItWorksSection = () => {
  return (
    // --- FINAL CORRECTION: Using bg-slate-50 to match the FeaturesSection ---
    <section className="flex flex-col min-h-screen bg-background"> 
      <div className="container mx-auto px-6">
        {/* Section Headline */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            How It Works: Your Path to Mental Fitness
          </h2>
        </div>

        {/* The rest of the component remains the same */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <InfoCard icon="🎯" title="Choose Your Focus">
            Select a science-backed program like "Rebuild Focus" or "Overcome Overthinking" tailored to your personal goals.
          </InfoCard>
          <InfoCard icon="🧠" title="Build Your Daily Habit">
            Complete a simple, 5-minute routine of guided exercises each day. It’s like a workout session for your mind.
          </InfoCard>
          <InfoCard icon="📈" title="See Your Progress">
            Track your streaks, watch your progress bar grow, and earn badges as you build a stronger, more resilient mind.
          </InfoCard>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">What are Habit Packs?</h3>
          <p className="text-gray-700 text-lg">
            Habit Packs are short, guided programs designed to rewire your mind in just 5 minutes a day. Each pack gives you a structured routine of exercises, prompts, and mini-challenges. It’s not just about feeling better; it’s about building lasting mental strength. Choose your goal. Show up daily. See the shift.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;