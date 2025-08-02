import React, { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import * as LucideIcons from 'lucide-react'; // Import all icons from Lucide

const AchievementsPage = () => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const { data } = await API.get('/badges');
        setEarnedBadges(data);
      } catch (err) {
        console.error('Failed to fetch badges', err);
        setError('Could not load your achievements. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBadges();
  }, []);

  // Helper function to dynamically render an icon by its name string
  const renderIcon = (iconName) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent className="w-12 h-12 text-cta-orange" /> : <LucideIcons.Award className="w-12 h-12 text-cta-orange" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <LucideIcons.Award className="w-10 h-10 text-primary-blue" />
            <h1 className="text-4xl font-bold text-primary-text">My Achievements</h1>
          </div>
          <p className="text-lg text-primary-text text-opacity-80 mb-8">
            Here are all the badges you've earned by staying consistent with your mental fitness journey. Keep up the great work!
          </p>

          {isLoading && <p className="text-center">Loading your achievements...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earnedBadges.length > 0 ? (
                earnedBadges.map(({ badge }) => (
                  <div key={badge._id} className="bg-white p-6 rounded-lg shadow-md border border-border-gray text-center flex flex-col items-center">
                    <div className="mb-4">
                      {renderIcon(badge.iconName)}
                    </div>
                    <h3 className="text-xl font-bold text-primary-text">{badge.name}</h3>
                    <p className="text-primary-text text-opacity-70 mt-1">{badge.description}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <LucideIcons.Trophy className="w-16 h-16 mx-auto text-border-gray" />
                  <p className="mt-4 text-primary-text text-opacity-70">You haven't earned any badges yet. Start a habit pack to begin!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AchievementsPage;
