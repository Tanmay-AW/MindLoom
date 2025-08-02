import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import MoodTracker from './MoodTracker.jsx';
import ActiveHabitPack from './ActiveHabitPack.jsx';

const TodaysFlow = () => {
  const [todaysMoodLog, setTodaysMoodLog] = useState(null);
  const [activeHabitPack, setActiveHabitPack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // This function will be passed down to the MoodTracker to update the parent state
  const onMoodLogged = (newLog) => {
    setTodaysMoodLog(newLog);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Fetch both statuses at the same time
        const [moodRes, packRes] = await Promise.all([
          API.get('/moods/today'),
          API.get('/habit-packs/active')
        ]);
        setTodaysMoodLog(moodRes.data);
        setActiveHabitPack(packRes.data);
      } catch (err) {
        console.error("Failed to fetch user status", err);
        setError("Could not load your daily flow. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (isLoading) {
    return <div className="text-center p-6 bg-white rounded-lg shadow-md mt-8">Loading your daily flow...</div>;
  }
  
  if (error) {
    return <div className="text-center p-6 bg-white rounded-lg shadow-md mt-8 text-red-500">{error}</div>;
  }

  // --- The Guided Journey Logic ---

  // Step 1: If the user hasn't logged their mood today, show the MoodTracker
  if (!todaysMoodLog) {
    return <MoodTracker onMoodLogged={onMoodLogged} />;
  }

  // Step 2: If mood is logged, check for an active habit pack
  if (activeHabitPack) {
    return <ActiveHabitPack />;
  }

  // Step 3: If mood is logged and there's no active pack, the day is complete
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8 text-center">
      <h3 className="text-xl font-bold text-accent-green">You're all set for today!</h3>
      <p className="mt-2 text-primary-text text-opacity-70">You've completed your daily check-in. Come back tomorrow to continue building your habits.</p>
      <Link to="/habit-packs">
        <button className="mt-4 bg-primary-blue text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90">
          Explore New Habit Packs
        </button>
      </Link>
    </div>
  );
};

export default TodaysFlow;
