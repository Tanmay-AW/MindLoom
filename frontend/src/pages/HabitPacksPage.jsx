import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import ActiveHabitPack from '../components/dashboard/ActiveHabitPack.jsx';
import BreathingWidget from '../components/dashboard/BreathingWidget.jsx';
import { Layers } from 'lucide-react';

const HabitPacksPage = () => {
  const [activePack, setActivePack] = useState(null);
  const [availablePacks, setAvailablePacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- THIS IS THE FIX ---
  // We create a single function to fetch all necessary data
  const loadPageData = async () => {
    setIsLoading(true);
    try {
      const activePackRes = await API.get('/habit-packs/active');
      setActivePack(activePackRes.data);

      if (!activePackRes.data) {
        const allPacksRes = await API.get('/habit-packs');
        setAvailablePacks(allPacksRes.data);
      }
    } catch (err) {
      console.error('Failed to load page data', err);
      setError('Could not load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when the page first mounts
  useEffect(() => {
    loadPageData();
  }, []);
  // --- END OF FIX ---

  const handleStartPack = async (packId) => {
    try {
      await API.post(`/habit-packs/${packId}/start`);
      // After starting a pack, we reload all the page data to show the active pack
      loadPageData(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start the pack.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow container mx-auto flex items-center justify-center">
          <p>Loading your habit packs...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto">
          {activePack ? (
            <>
              <BreathingWidget />
              {/* We pass the 'loadPageData' function so the component can refresh itself */}
              <ActiveHabitPack activePackData={activePack} onTaskComplete={loadPageData} />
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4 mb-8">
                <Layers className="w-10 h-10 text-primary-blue" />
                <h1 className="text-4xl font-bold text-primary-text">Habit Packs</h1>
              </div>
              <p className="text-lg text-primary-text text-opacity-80 mb-8">
                Start a guided journey to build powerful mental habits. Each pack is a multi-day program with a specific goal.
              </p>
              {error && <p className="text-center text-red-500 mb-4">{error}</p>}
              <div className="space-y-6">
                {availablePacks.map((pack) => (
                  <div key={pack._id} className="bg-white p-6 rounded-lg shadow-md border border-border-gray flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-primary-text">{pack.title}</h3>
                      <p className="text-primary-text text-opacity-70 mt-1">{pack.description}</p>
                      <p className="text-sm font-semibold text-primary-blue mt-2">{pack.duration} Days</p>
                    </div>
                    <button
                      onClick={() => handleStartPack(pack._id)}
                      className="mt-4 md:mt-0 bg-cta-orange text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition-all"
                    >
                      Start Pack
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HabitPacksPage;
