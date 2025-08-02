import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "MindLoom has completely changed my morning routine. The 5-minute sessions are the perfect way to start my day with clarity and focus. It's brilliant.",
    name: 'Sarah J.',
    role: 'Product Designer',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    quote: "As a student, stress is constant. CalmBot's prompts help me reframe my thoughts. I've seen a real improvement in my mood and productivity.",
    name: 'David L.',
    role: 'University Student',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
];

const TestimonialsSection = () => {
  return (
    // FIXED: Background is now the main Off-White for consistency.
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-text">
            Loved by People Like You
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md border border-border-gray flex flex-col">
              {/* IMPROVEMENT: Added a decorative quote icon for depth. */}
              <Quote className="w-8 h-8 text-accent-green mb-4" />
              <p className="text-primary-text text-lg italic mb-6 flex-grow">
                {testimonial.quote}
              </p>
              <div className="flex items-center mt-auto">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4 border-2 border-brand-navy" />
                <div>
                  <h4 className="font-bold text-primary-text">{testimonial.name}</h4>
                  <p className="text-primary-text text-opacity-80">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
