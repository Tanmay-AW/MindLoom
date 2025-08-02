import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import StreakTracker from '../components/dashboard/StreakTracker.jsx';
import { Layers, BookText, LineChart, MessageSquare } from 'lucide-react';

const DashboardPage = () => {
  const { userInfo } = useAuth();

  const features = [
    { name: 'Habit Packs', link: '/habit-packs', icon: <Layers /> },
    { name: 'My Journal', link: '/journal', icon: <BookText /> },
    { name: 'Mood Timeline', link: '/timeline', icon: <LineChart /> },
    { name: 'Talk to CalmBot', link: '/chat', icon: <MessageSquare /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-primary-text">
                Welcome back, <span className="text-primary-blue">{userInfo?.name}</span>
              </h1>
              <p className="mt-2 text-lg text-primary-text text-opacity-80">
                What would you like to focus on today?
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <StreakTracker />
            </div>
          </div>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {features.map((feature) => (
              <Link to={feature.link} key={feature.name} className="bg-white p-6 rounded-lg shadow-md border border-border-gray hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-blue bg-opacity-10 p-3 rounded-lg">
                    {React.cloneElement(feature.icon, { className: 'w-6 h-6 text-primary-blue' })}
                  </div>
                  <h3 className="text-xl font-bold text-primary-text">{feature.name}</h3>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
