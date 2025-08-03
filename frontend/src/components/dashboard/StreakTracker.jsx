import React, { useState, useEffect } from 'react';
import API from '../../api';

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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-border-gray text-center w-40">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="text-5xl">🔥</div>
          <p className="text-2xl font-bold text-primary-text mt-1">{streak}</p>
          <p className="text-sm text-primary-text text-opacity-70">Day Streak</p>
        </>
      )}
    </div>
  );
};

export default StreakTracker;
