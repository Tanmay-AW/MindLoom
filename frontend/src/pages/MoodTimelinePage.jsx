import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MoodGraph from '../components/dashboard/MoodGraph.jsx';
import { LineChart } from 'lucide-react';

const MoodTimelinePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <LineChart className="w-10 h-10 text-primary-blue" />
            <h1 className="text-4xl font-bold text-primary-text">Mood Timeline</h1>
          </div>
          <p className="text-lg text-primary-text text-opacity-80 mb-8">
            Here is a visual representation of your mood check-ins over time. Recognizing patterns is a powerful step in understanding your emotional well-being.
          </p>
          
          <MoodGraph />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MoodTimelinePage;
