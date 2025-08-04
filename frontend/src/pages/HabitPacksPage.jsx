import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import { Layers } from 'lucide-react';

const HabitPacksPage = () => {
  const [packs, setPacks] = useState([]);
  const [activePack, setActivePack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const [packsRes, activePackRes] = await Promise.all([
          API.get('/habit-packs'),
          API.get('/habit-packs/active')
        ]);
        setPacks(packsRes.data);
        setActivePack(activePackRes.data);
      } catch (err) {
        setError('Could not load habit packs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPageData();
  }, []);

  const handleStartPack = async (packId) => {
    try {
      await API.post(`/habit-packs/${packId}/start`);
      navigate('/daily-task');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start the pack.');
    }
  };

  const handleContinuePack = () => {
    navigate('/daily-task');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Layers className="w-10 h-10 text-primary-blue" />
            <h1 className="text-4xl font-bold text-primary-text">Habit Packs</h1>
          </div>
          <p className="text-lg text-primary-text text-opacity-80 mb-8">
            Start a guided journey to build powerful mental habits. Each pack is a multi-day program with a specific goal.
          </p>

          {isLoading && <p className="text-center">Loading packs...</p>}
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}

          {!isLoading && (
            <div className="space-y-6">
              {packs.map((pack) => {
                const isThisPackActive = activePack && activePack.habitPack?._id === pack._id;
                const isAnotherPackActive = activePack && !isThisPackActive;

                return (
                  <div key={pack._id} className="bg-white p-6 rounded-lg shadow-md border border-border-gray flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-primary-text">{pack.title}</h3>
                      <p className="text-primary-text text-opacity-70 mt-1">{pack.description}</p>
                      <p className="text-sm font-semibold text-primary-blue mt-2">{pack.duration} Days</p>
                    </div>
                    <button
                      onClick={() => isThisPackActive ? handleContinuePack() : handleStartPack(pack._id)}
                      disabled={isAnotherPackActive} 
                      className="mt-4 md:mt-0 bg-cta-orange text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isThisPackActive ? 'Continue Pack' : (isAnotherPackActive ? 'Pack in Progress' : 'Start Pack')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HabitPacksPage;
