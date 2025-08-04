import React, { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import BreathingWidget from '../components/dashboard/BreathingWidget.jsx';
import TaskCard from '../components/dashboard/TaskCard.jsx';
import TextInputTask from '../components/dashboard/TextInputTask.jsx';
import MultipleChoiceTask from '../components/dashboard/MultipleChoiceTask.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const DailyTaskPage = () => {
  const { userInfo } = useAuth();
  const [dailyProgress, setDailyProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDailyTasks = async () => {
    try {
      const { data } = await API.get('/habit-packs/daily-task');
      setDailyProgress(data);
    } catch (err) {
      console.error("Failed to fetch daily tasks", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyTasks();
  }, []);

  const handleTaskSubmit = async (taskId, response) => {
    try {
      const { data: updatedProgress } = await API.post('/habit-packs/submit-task', { taskId, response });
      setDailyProgress(updatedProgress); // Update the page with the new progress
      
      // After the last task is done, check for badges
      if (updatedProgress.isCompleted) {
        API.post('/badges/check');
      }
    } catch (err) {
      console.error("Failed to submit task", err);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading Today's Focus...</div>;
  }

  // Find the index of the last completed task
  const lastCompletedIndex = dailyProgress ? dailyProgress.entries.length - 1 : -1;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary-text">Today's Focus</h1>
            <p className="mt-2 text-lg text-primary-text text-opacity-80">Hello, {userInfo?.name}. Let's complete your daily check-in.</p>
          </div>

          <div className="space-y-6">
            {/* Mandatory Breathing Widget */}
            <BreathingWidget onComplete={() => { /* Logic to unlock next can be added if needed */ }} />

            {/* Render the list of dynamic tasks */}
            {dailyProgress?.tasks.map((task, index) => {
              const isLocked = index > lastCompletedIndex + 1;
              const isComplete = dailyProgress.entries.some(entry => entry.taskId === task.taskId);

              return (
                <TaskCard key={task.taskId} title={`Task ${index + 1}`} isLocked={isLocked} isComplete={isComplete}>
                  {task.taskType === 'textInput' && <TextInputTask task={task} onSubmit={handleTaskSubmit} />}
                  {task.taskType === 'multipleChoice' && <MultipleChoiceTask task={task} onSubmit={handleTaskSubmit} />}
                </TaskCard>
              );
            })}

            {/* Completion Message */}
            {dailyProgress?.isCompleted && (
              <div className="bg-accent-green bg-opacity-10 text-accent-green font-semibold p-6 rounded-lg shadow-md text-center">
                🎉 You’ve completed all your tasks for today! Come back tomorrow to continue your streak and grow stronger.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DailyTaskPage;
