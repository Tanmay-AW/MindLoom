import React, { useState, useEffect } from 'react';
import API from '../../api';
import { BookText, Award, Meh, CheckCircle, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickStats = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {/* Loading Skeletons */}
        <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse h-24"></div>
        <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse h-24"></div>
        <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse h-24"></div>
      </div>
    );
  }

  // Render active pack progress if available
  const renderActivePackProgress = () => {
    if (!stats.activePackTitle) return null;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border-t-2 border-primary-blue mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-primary-text">Active Habit Pack</h3>
          <Link to="/daily-task" className="text-xs text-primary-blue hover:underline">Continue →</Link>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div 
            className="bg-primary-blue h-2.5 rounded-full" 
            style={{ width: `${stats.activePackProgress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-primary-text text-opacity-70">
          <span>{stats.activePackProgress}% complete</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <BookText className="mx-auto mb-2 text-primary-blue" />
          <p className="text-2xl font-bold text-primary-text">{stats.entriesThisWeek}</p>
          <p className="text-sm text-primary-text text-opacity-70">Entries this week</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <Meh className="mx-auto mb-2 text-primary-blue" />
          <p className="text-2xl font-bold text-primary-text">{stats.avgMood}</p>
          <p className="text-sm text-primary-text text-opacity-70">Avg. mood this week</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <CheckCircle className="mx-auto mb-2 text-primary-blue" />
          <p className="text-2xl font-bold text-primary-text">{stats.completedTasksCount}</p>
          <p className="text-sm text-primary-text text-opacity-70">Tasks completed</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <Award className="mx-auto mb-2 text-primary-blue" />
          <p className="text-2xl font-bold text-primary-text">{stats.achievementsCount}</p>
          <p className="text-sm text-primary-text text-opacity-70">Achievements unlocked</p>
        </div>
      </div>
      
      {/* Render active pack progress if available */}
      {renderActivePackProgress()}
    </>
  );
};

export default QuickStats;
