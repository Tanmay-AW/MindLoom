// src/components/common/ProgressGrowthChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', progress: 20 },
  { month: 'Feb', progress: 35 },
  { month: 'Mar', progress: 50 },
  { month: 'Apr', progress: 65 },
  { month: 'May', progress: 80 },
  { month: 'Jun', progress: 90 },
];

export default function ProgressGrowthChart() {
  return (
    <section id="features" className="py-20 md:py-32 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold [text-shadow:0_0_10px_rgba(0,0,0,0.3)]">
            Visualize Your Progress
          </h2>
          <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
           See how your habits and consistency shape your journey over time.
          </p>
        </div>
    <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Progress Your Growth</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="month" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
          <Line type="monotone" dataKey="progress" stroke="#4ade80" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
        </div>
    </section>
  );
}
