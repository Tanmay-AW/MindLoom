import React from 'react';
import { Target, Brain, BarChart3 } from 'lucide-react';
import GlowingCards, { GlowingCard } from './GlowingCard';

const steps = [
  {
    icon: <Target size={40} className="text-rose-300" />,
    title: "Choose Your Focus",
    description: "Select a science-backed program like \"Rebuild Focus\" or \"Overcome Overthinking\" tailored to your personal goals."
  },
  {
    icon: <Brain size={40} className="text-indigo-300" />,
    title: "Build Your Daily Habit",
    description: "Complete a simple, 5-minute routine of guided exercises each day. It’s like a workout session for your mind."
  },
  {
    icon: <BarChart3 size={40} className="text-amber-300" />,
    title: "See Your Progress",
    description: "Track your streaks, watch your progress bar grow, and earn badges as you build a stronger, more resilient mind."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-32 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold [text-shadow:0_0_10px_rgba(0,0,0,0.3)]">
            How It Works: Your Path to Mental Fitness
          </h2>
        </div>

        <GlowingCards gap="2rem" maxWidth="75rem" padding="0" enableGlow={true}>
          {steps.map((step, index) => (
            <GlowingCard key={index} glowColor={
              index === 0 ? '#fb7185' : index === 50 ? '#818cf8' : '#fbbf24'
            } className="flex flex-col items-center text-center px-8 py-12">
              <div className="mb-6 flex items-center justify-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-800/40 backdrop-blur-lg rounded-full border border-white/10 shadow-2xl">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-lg text-gray-300 max-w-md">{step.description}</p>
            </GlowingCard>
          ))}
        </GlowingCards>

        <div className="max-w-3xl mx-auto text-center mt-24 md:mt-32">
          <h3 className="text-3xl font-semibold text-white mb-4">What are Habit Packs?</h3>
          <p className="text-gray-300 text-lg">
            Habit Packs are short, guided programs designed to rewire your mind in just 5 minutes a day. Each pack gives you a structured routine of exercises, prompts, and mini-challenges. It’s not just about feeling better; it’s about building lasting mental strength. Choose your goal. Show up daily. See the shift.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
