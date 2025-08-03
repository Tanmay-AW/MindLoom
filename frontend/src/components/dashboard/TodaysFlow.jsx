import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import MoodTracker from './MoodTracker.jsx';
import ActiveHabitPack from './ActiveHabitPack.jsx';

const TodaysFlow = () => {
  const [todaysMoodLog, setTodaysMoodLog] = useState(null);
  const [activeHabitPack, setActiveHabitPack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const [moodRes, packRes] = await Promise.all([
        API.get('/moods/today'),
        API.get('/habit-packs/active')
      ]);
      setTodaysMoodLog(moodRes.data);
      setActiveHabitPack(packRes.data);
    } catch (err) {
      console.error("Failed to fetch user status", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (isLoading) {
    return <div className="text-center p-6 bg-white rounded-lg shadow-md mt-8">Loading your daily flow...</div>;
  }

  // --- The Guided Journey Logic ---

  // Step 1: If the user hasn't logged their mood today, show the MoodTracker
  if (!todaysMoodLog) {
    // We pass the fetchStatus function so the MoodTracker can refresh the flow
    return <MoodTracker onMoodLogged={fetchStatus} />;
  }

  // Step 2: If mood is logged, check for an active habit pack
  if (activeHabitPack) {
    return <ActiveHabitPack activePackData={activePack} onTaskComplete={fetchStatus} />;
  }

  // Step 3: If everything is done, show the completion message
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
