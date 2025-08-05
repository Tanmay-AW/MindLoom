import React, { useState, useEffect } from 'react';
import API from '../../api';
import { Flame, Calendar, Award } from 'lucide-react';

const StreakTracker = () => {
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [streakMilestone, setStreakMilestone] = useState('');

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const { data } = await API.get('/streaks');
        setStreak(data.streak);
        
        // Set milestone message based on streak count
        if (data.streak >= 30) {
          setStreakMilestone('Monthly Master! 🏆');
        } else if (data.streak >= 7) {
          setStreakMilestone('Weekly Warrior! 🌟');
        } else if (data.streak >= 3) {
          setStreakMilestone('Getting Started! 👏');
        } else if (data.streak > 0) {
          setStreakMilestone('Keep going! 💪');
        }
      } catch (err) {
        console.error('Could not fetch streak', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStreak();
  }, []);

  // Generate streak dots for visual representation
  const renderStreakDots = () => {
    const dots = [];
    const maxDotsToShow = 7; // Show max 7 dots
    const dotsToRender = Math.min(streak, maxDotsToShow);
    
    for (let i = 0; i < dotsToRender; i++) {
      dots.push(
        <div 
          key={i} 
          className="h-2 w-2 rounded-full bg-primary-blue"
          title={`Day ${i+1}`}
        />
      );
    }
    
    // Add indicator for more days if streak > maxDotsToShow
    if (streak > maxDotsToShow) {
      dots.push(
        <div key="more" className="text-xs text-primary-blue font-medium">+{streak - maxDotsToShow}</div>
      );
    }
    
    return dots;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-border-gray text-center w-48">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex justify-center items-center mb-2">
            <Flame className="text-orange-500 w-6 h-6 mr-1" />
            <Calendar className="text-primary-blue w-5 h-5" />
          </div>
          
          <p className="text-3xl font-bold text-primary-text">{streak}</p>
          <p className="text-sm text-primary-text text-opacity-70 mb-2">Day Streak</p>
          
          {/* Streak milestone message */}
          {streakMilestone && (
            <p className="text-xs text-primary-blue font-medium mb-2">{streakMilestone}</p>
          )}
          
          {/* Visual streak representation */}
          <div className="flex justify-center items-center space-x-1 mt-1">
            {renderStreakDots()}
          </div>
        </>
      )}
    </div>
  );
};

export default StreakTracker;
