import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import ActiveHabitPack from '../components/dashboard/ActiveHabitPack.jsx';
import BreathingWidget from '../components/dashboard/BreathingWidget.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const DailyTaskPage = () => {
  const { userInfo } = useAuth();
  // NEW: State to manage which step the user is on
  const [currentStep, setCurrentStep] = useState('breathing'); // 'breathing' or 'habit'

  // This function will be called by the BreathingWidget when it's complete
  const handleBreathingComplete = () => {
    setCurrentStep('habit'); // Move to the next step
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary-text">
              Today's Focus
            </h1>
            <p className="mt-2 text-lg text-primary-text text-opacity-80">
              Hello, {userInfo?.name}. Let's complete your daily check-in.
            </p>
          </div>
          
          {/* --- The Guided Journey Logic --- */}
          
          {/* Step 1: Breathing Exercise */}
          <div className={currentStep === 'breathing' ? 'block' : 'hidden'}>
            <h2 className="text-2xl font-bold text-primary-text mb-4">Step 1: A Moment of Calm</h2>
            <BreathingWidget onComplete={handleBreathingComplete} />
          </div>

          {/* Step 2: Habit Pack Task */}
          <div className={currentStep === 'habit' ? 'block' : 'hidden'}>
            <h2 className="text-2xl font-bold text-primary-text mb-4">Step 2: Your Daily Reflection</h2>
            <ActiveHabitPack />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DailyTaskPage;
