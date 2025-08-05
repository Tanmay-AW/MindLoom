import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import API from '../api';

const HabitPacksPage = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/habit-packs');
        setPacks(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load habit packs. Please try again.');
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  const startPack = async (packId) => {
    try {
      setLoading(true);
      await API.post(`/habit-packs/${packId}/start`);
      navigate('/daily-task');
    } catch (err) {
      setError('Failed to start habit pack. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-16">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 mt-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary-text">Choose Your Habit Pack</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packs.map((pack) => (
            <div key={pack._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-border-gray">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-primary-text">{pack.title}</h2>
                <p className="text-primary-text text-opacity-70 mb-4">{pack.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-text text-opacity-60">{pack.duration || 21} days • {pack.tasksPerDay} tasks per day</span>
                  <button
                    onClick={() => startPack(pack._id)}
                    className="flex items-center bg-cta-orange hover:bg-opacity-90 text-white font-bold px-4 py-2 rounded-md transition-colors duration-300"
                  >
                    Start <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HabitPacksPage;
