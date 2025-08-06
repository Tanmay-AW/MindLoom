import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import BreathingWidget from '../components/dashboard/BreathingWidget.jsx';
import DayProgressBar from '../components/tasks/DayProgressBar.jsx';
import TaskRenderer from '../components/tasks/TaskRenderer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import API from '../api';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const DailyTaskPage = () => {
  const { userInfo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activePack, setActivePack] = useState(location.state?.activePack || null);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [breathingComplete, setBreathingComplete] = useState(false);
  const [error, setError] = useState('');

  // --- CHANGE 1: Moved the fetching logic into a useCallback function ---
  const fetchDailyData = useCallback(async () => {
    // We don't want to show the loader on re-fetch, only on initial load.
    // setIsLoading(true) is only called on initial useEffect.
    
    let packToProcess = activePack;

    if (!packToProcess) {
      try {
        const { data } = await API.get('/habit-packs/active');
        packToProcess = data;
      } catch (err) {
        console.error("Failed to fetch active pack", err);
        setError("Could not load your daily tasks. Please try starting a pack again.");
        setIsLoading(false);
        return;
      }
    }

    if (packToProcess) {
      const { data: updatedPackData } = await API.get('/habit-packs/active');
      setActivePack(updatedPackData);
      
      const currentDayProgress = updatedPackData.dailyProgress.find(p => p.day === updatedPackData.currentDay);
      if (currentDayProgress) {
        setTodaysTasks(currentDayProgress.tasks);
        const initialCompleted = currentDayProgress.entries.map(e => e.taskId.toString());
        setCompletedTaskIds(initialCompleted);
        
        const breathingCompleted = localStorage.getItem(`breathing_completed_${updatedPackData.currentDay}`);
        if (breathingCompleted === 'true') {
          setBreathingComplete(true);
        }
      } else {
        try {
          const { data: newDayTasks } = await API.get('/habit-packs/daily-task');
          if(newDayTasks) {
            const { data: finalPackData } = await API.get('/habit-packs/active');
            setActivePack(finalPackData);
            setTodaysTasks(newDayTasks.tasks);
            setCompletedTaskIds([]);
            setBreathingComplete(false);
            localStorage.removeItem(`breathing_completed_${finalPackData.currentDay}`);
          }
        } catch(err) {
          console.error("Failed to generate tasks for new day", err);
        }
      }
    }
    setIsLoading(false);
  }, []); // useCallback dependencies

  useEffect(() => {
    fetchDailyData();
  }, [fetchDailyData]); // Run only once on page load

  const handleBreathingComplete = () => {
    setBreathingComplete(true);
    if (activePack) {
      localStorage.setItem(`breathing_completed_${activePack.currentDay}`, 'true');
    }
  };

  // --- CHANGE 2: Updated handleTaskComplete to refetch data ---
  const handleTaskComplete = async (taskId) => {
    // Optimistically update the local state for instant UI feedback
    setCompletedTaskIds(prev => [...new Set([...prev, taskId.toString()])]);

    // Re-fetch all data from the server to ensure UI is fully synced
    await fetchDailyData();

    // Check for badges after the data has been confirmed and updated
    const allTasksNowDone = todaysTasks.length > 0 && 
      todaysTasks.filter(t => t.taskType !== 'breathing')
                 .every(task => [...completedTaskIds, taskId.toString()].includes(task.taskId.toString()));

    if (allTasksNowDone && breathingComplete) {
      setTimeout(async () => {
        try {
          await API.post('/badges/check');
          console.log('Badge check triggered after completing all tasks');
        } catch (err) {
          console.error('Failed to check for badges', err);
        }
      }, 500);
    }
  };

  const nonBreathingTasks = todaysTasks.filter(task => task.taskType !== 'breathing');
  const allTasksDone = nonBreathingTasks.length > 0 && nonBreathingTasks.every(task => completedTaskIds.includes(task.taskId.toString()));

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-blue" />
        </main>
        <Footer />
      </div>
    );
  }

  // ... rest of the component's return statement (no changes there)
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto">
          {error && <p className="text-center text-red-500">{error}</p>}

          {!error && activePack ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary-text">Today's Focus</h1>
              <p className="mt-2 text-lg text-primary-text text-opacity-80">
                Hello, {userInfo?.name || 'Friend'}. Let's complete your daily check-in.
              </p>

              <DayProgressBar habitPack={activePack} />

              <div className="space-y-8 mt-8">
                <section>
                  <h2 className="text-2xl font-bold text-primary-text mb-4">Step 1: A Moment of Calm</h2>
                  <div className="relative">
                    <BreathingWidget onComplete={handleBreathingComplete} />
                    {breathingComplete && (
                      <div className="absolute top-0 right-0 bg-accent-green text-white px-3 py-1 rounded-full text-sm font-bold">
                        Done!
                      </div>
                    )}
                  </div>
                </section>

                <section className={`transition-all duration-500 ${!breathingComplete ? 'opacity-50 pointer-events-none filter blur-sm' : 'opacity-100'}`}>
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-primary-text">Step 2: Mind Games</h2>
                    {breathingComplete && (
                      <ArrowRight className="ml-2 text-accent-green animate-pulse" size={20} />
                    )}
                  </div>
                  
                  {!breathingComplete ? (
                      <div className="p-4 text-sm text-primary-text text-opacity-60 border border-dashed border-gray-300 rounded-md">
                        Complete the breathing session to unlock your tasks.
                      </div>
                  ) : (
                    <div className="space-y-4">
                      {todaysTasks.length > 0 ? todaysTasks.filter(task => task.taskType !== 'breathing').map((task, index) => {
                        const isCompleted = completedTaskIds.includes(task.taskId.toString());
                        const isUnlocked = index === 0 || completedTaskIds.includes(todaysTasks.filter(t => t.taskType !== 'breathing')[index - 1]?.taskId.toString());

                        return (
                          <div key={task.taskId} className={`transition-all duration-500 ${!isUnlocked ? 'opacity-50 pointer-events-none filter blur-sm' : 'opacity-100'}`}>
                            <div className="flex items-center mb-2">
                              <span className="bg-primary-blue text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                                Task {index + 1}
                              </span>
                              {isCompleted && (
                                <span className="text-accent-green text-xs font-bold">Completed!</span>
                              )}
                            </div>
                            <TaskRenderer 
                              task={task} 
                              onComplete={handleTaskComplete}
                              isCompleted={isCompleted}
                            />
                          </div>
                        );
                      }) : <p>No tasks for today.</p>}
                    </div>
                  )}
                </section>
              </div>

              {allTasksDone && breathingComplete && (
                <div className="animate-fade-in bg-white p-6 rounded-lg shadow-md border border-accent-green mt-8 text-center">
                  <CheckCircle className="w-12 h-12 text-accent-green mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-primary-text mb-2">All Done for Today!</h2>
                  <p className="text-primary-text text-opacity-80">
                    Great work! You've completed all tasks for Day {activePack?.currentDay || 1} of your 21-day journey.
                  </p>
                  <p className="text-primary-text text-opacity-70 mt-2">
                    Come back tomorrow to continue building your streak.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-primary-text">No Active Habit Pack</h1>
              <p className="mt-2 text-primary-text text-opacity-80">You haven't started a habit pack yet. Why not start one today?</p>
              <Link to="/habit-packs" className="mt-4 inline-block bg-cta-orange text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90">
                Browse Packs
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DailyTaskPage;