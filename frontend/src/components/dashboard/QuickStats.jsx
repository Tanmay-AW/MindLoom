import React, { useState, useEffect } from 'react';
import API from '../../api';
import { BookText, Award, Meh } from 'lucide-react';

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
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
        <Award className="mx-auto mb-2 text-primary-blue" />
        <p className="text-2xl font-bold text-primary-text">{stats.achievementsCount}</p>
        <p className="text-sm text-primary-text text-opacity-70">Achievements unlocked</p>
      </div>
    </div>
  );
};

export default QuickStats;
