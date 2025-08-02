import React, { useState, useEffect } from 'react';
import API from '../../api';
import { Flame } from 'lucide-react'; // A fire icon for the streak

const StreakTracker = () => {
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const { data } = await API.get('/streaks');
        setStreak(data.streak);
      } catch (err) {
        console.error('Could not fetch streak', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreak();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-border-gray mt-8 text-center">
        <p>Loading streak...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8">
      <div className="flex items-center justify-center space-x-4">
        <Flame className="w-10 h-10 text-cta-orange" />
        <div>
          <p className="text-3xl font-bold text-primary-text">{streak}</p>
          <p className="text-sm text-primary-text text-opacity-70">Day Streak</p>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;
