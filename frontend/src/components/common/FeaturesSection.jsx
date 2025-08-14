import React from 'react';
import { Zap, BrainCircuit, TrendingUp } from 'lucide-react';
import GlowingCards, { GlowingCard } from './GlowingCard';

const features = [
  {
    icon: <Zap size={32} className="text-teal-300" />,
    title: 'Daily 5-Minute Routines',
    description: 'Build powerful mental habits with short, effective routines that fit seamlessly into your day.',
  },
  {
    icon: <BrainCircuit size={32} className="text-teal-300" />,
    title: 'AI-Powered Guidance',
    description: 'Our AI coach, CalmBot, provides proactive prompts and reflections to guide your mental fitness journey.',
  },
  {
    icon: <TrendingUp size={32} className="text-teal-300" />,
    title: 'Track Your Progress',
    description: 'Stay motivated by tracking your mood, monitoring your streaks, and watching your mental strength grow over time.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 md:py-32 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold [text-shadow:0_0_10px_rgba(0,0,0,0.3)]">
            Everything You Need for a Stronger Mind
          </h2>
          <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
            MindLoom is designed to be simple, proactive, and effective, integrating seamlessly into your life.
          </p>
        </div>

        <GlowingCards gap="2rem" maxWidth="75rem" padding="0" enableGlow={true}>
          {features.map((feature, index) => (
            <GlowingCard key={index} glowColor="#14b8a6" className="flex flex-col items-center text-center px-8 py-12">
              <div className="flex justify-center items-center mb-6 w-16 h-16 bg-teal-500/10 rounded-full mx-auto border border-teal-500/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </GlowingCard>
          ))}
        </GlowingCards>
      </div>
    </section>
  );
};

export default FeaturesSection;
