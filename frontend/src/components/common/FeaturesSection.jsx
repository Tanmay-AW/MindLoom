import React from 'react';
import { Zap, BrainCircuit, TrendingUp } from 'lucide-react';

const features = [
  {
    // FIXED: Icon color now uses brand-navy
    icon: <Zap size={40} className="text-brand-navy" />,
    title: 'Daily 5-Minute Routines',
    description: 'Build powerful mental habits with short, effective routines that fit seamlessly into your day.',
  },
  {
    // FIXED: Icon color now uses brand-navy
    icon: <BrainCircuit size={40} className="text-brand-navy" />,
    title: 'AI-Powered Guidance',
    description: 'Our AI coach, CalmBot, provides proactive prompts and reflections to guide your mental fitness journey.',
  },
  {
    // FIXED: Icon color now uses brand-navy
    icon: <TrendingUp size={40} className="text-brand-navy" />,
    title: 'Track Your Progress',
    description: 'Stay motivated by tracking your mood, monitoring your streaks, and watching your mental strength grow over time.',
  },
];

const FeaturesSection = () => {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-text">
            Everything You Need for a Stronger Mind
          </h2>
          <p className="text-lg text-primary-text mt-4 max-w-2xl mx-auto">
            MindLoom is designed to be simple, proactive, and effective.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-border-gray">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-2">
                {feature.title}
              </h3>
              <p className="text-primary-text">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
