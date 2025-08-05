import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import StreakTracker from '../components/dashboard/StreakTracker.jsx';
import DailyQuote from '../components/dashboard/DailyQuote.jsx';
import QuickStats from '../components/dashboard/QuickStats.jsx';
import API from '../api';
import { Layers, BookText, LineChart, MessageSquare, Clock, ArrowRight } from 'lucide-react';

const DashboardPage = () => {
  const { userInfo } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const { data } = await API.get('/dashboard/recent-activity');
        setRecentActivity(data.activities || []);
      } catch (err) {
        console.error('Failed to fetch recent activity', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // For now, we'll use mock data since the endpoint might not exist yet
    const mockData = [
      { type: 'journal', title: 'Added a journal entry', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { type: 'mood', title: 'Logged mood as Happy', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
      { type: 'task', title: 'Completed breathing exercise', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ];
    
    // Simulate API call
    setTimeout(() => {
      setRecentActivity(mockData);
      setIsLoading(false);
    }, 500);
    
    // Uncomment when endpoint is ready
    // fetchRecentActivity();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${userInfo?.name} 🌞`;
    if (hour < 18) return `Good afternoon, ${userInfo?.name} 🌤️`;
    return `Good evening, ${userInfo?.name} 🌙`;
  };

  const features = [
    { name: 'Daily Task', link: '/daily-task', icon: <Layers /> },
    { name: 'My Journal', link: '/journal', icon: <BookText /> },
    { name: 'Mood Timeline', link: '/timeline', icon: <LineChart /> },
    { name: 'Talk to CalmBot', link: '/chat', icon: <MessageSquare /> },
  ];
  
  // Format relative time (e.g., "2 hours ago")
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };
  
  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'journal': return <BookText className="w-4 h-4 text-primary-blue" />;
      case 'mood': return <LineChart className="w-4 h-4 text-primary-blue" />;
      case 'task': return <Layers className="w-4 h-4 text-primary-blue" />;
      default: return <Clock className="w-4 h-4 text-primary-blue" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 mb-8">
           <div>
           <h1 className="text-4xl font-bold text-primary-text">
            {getGreeting()}
            </h1>
             <p className="mt-2 text-lg text-primary-text text-opacity-80">
                  What would you like to focus on today?
             </p>
            </div>
            <div className="justify-self-start md:justify-self-end">
            <StreakTracker />
           </div>
           </div>


          <DailyQuote />

          {/* Quick Glance Metrics */}
          <QuickStats />
          
          {/* Recent Activity */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary-text">Recent Activity</h2>
              <Link to="/achievements" className="text-sm text-primary-blue hover:underline flex items-center">
                View all <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-md border border-border-gray p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md border border-border-gray divide-y divide-gray-100">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary-blue bg-opacity-10 p-2 rounded-full mr-3">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-primary-text font-medium">{activity.title}</p>
                        <p className="text-xs text-primary-text text-opacity-60">{getRelativeTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-border-gray p-6 text-center">
                <p className="text-primary-text text-opacity-70">No recent activity to show</p>
                <p className="text-sm text-primary-text text-opacity-50 mt-1">Complete tasks or add journal entries to see them here</p>
              </div>
            )}
          </div>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {features.map((feature) => (
              <Link to={feature.link} key={feature.name} className="bg-white p-6 rounded-lg shadow-md border border-border-gray hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-blue bg-opacity-10 p-3 rounded-lg">
                    {React.cloneElement(feature.icon, { className: 'w-6 h-6 text-primary-blue' })}
                  </div>
                  <h3 className="text-xl font-bold text-primary-text">{feature.name}</h3>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
