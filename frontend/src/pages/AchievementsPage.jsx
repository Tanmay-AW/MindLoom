import React, { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import * as LucideIcons from 'lucide-react';

const AchievementsPage = () => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [categorizedBadges, setCategorizedBadges] = useState({
    streak: [],
    journal: [],
    pack: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to generate sample achievement data
  const generateSampleBadges = () => {
    console.log('Generating sample badges');
    
    // Create sample badge data
    const sampleBadges = [
      {
        _id: 'sample1',
        badge: {
          _id: 'badge1',
          name: 'Consistency Champion',
          description: 'Maintained a 7-day streak of daily mood logging',
          iconName: 'Award',
          type: 'streak',
          requirement: 7
        },
        earnedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        isSample: true
      },
      {
        _id: 'sample2',
        badge: {
          _id: 'badge2',
          name: 'Reflection Master',
          description: 'Completed 5 journal entries',
          iconName: 'BookOpen',
          type: 'journal',
          requirement: 5
        },
        earnedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        isSample: true
      },
      {
        _id: 'sample3',
        badge: {
          _id: 'badge3',
          name: 'Habit Builder',
          description: 'Completed your first habit pack',
          iconName: 'CheckCircle',
          type: 'pack',
          requirement: 1
        },
        earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        isSample: true
      },
      {
        _id: 'sample4',
        badge: {
          _id: 'badge4',
          name: 'Mindfulness Maven',
          description: 'Completed a 14-day streak of daily mood logging',
          iconName: 'Star',
          type: 'streak',
          requirement: 14
        },
        earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isSample: true
      },
      {
        _id: 'sample5',
        badge: {
          _id: 'badge5',
          name: 'Journal Journey',
          description: 'Completed 10 journal entries',
          iconName: 'Book',
          type: 'journal',
          requirement: 10
        },
        earnedAt: new Date(), // Today
        isSample: true
      }
    ];
    
    return sampleBadges;
  };
  
  // Function to load sample data
  const loadSampleBadges = () => {
    console.log('Loading sample badges');
    const sampleBadges = generateSampleBadges();
    
    setEarnedBadges(sampleBadges);
    
    // Categorize badges by type
    const categorized = {
      streak: [],
      journal: [],
      pack: []
    };
    
    sampleBadges.forEach(userBadge => {
      if (userBadge.badge && userBadge.badge.type) {
        categorized[userBadge.badge.type].push(userBadge);
      }
    });
    
    setCategorizedBadges(categorized);
    setError(null);
    setIsLoading(false);
    
    console.log('Sample badges loaded:', sampleBadges);
  };

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        // Check if user is authenticated
        const userInfo = localStorage.getItem('userInfo');
        console.log('Auth check:', userInfo ? 'User authenticated' : 'User not authenticated');
        
        if (!userInfo) {
          console.log('User not authenticated, showing sample data');
          loadSampleBadges();
          return;
        }
        
        // First fetch badges
        console.log('Fetching badges...');
        let { data } = await API.get('/badges');
        console.log('Badges fetched successfully:', data);
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('No badges returned from backend. Raw response:', data);
        } else {
          data.forEach((badgeObj, idx) => {
            console.log(`Badge[${idx}]:`, badgeObj);
          });
        }
        let validBadges = data.filter(userBadge => userBadge?.badge);
        if (validBadges.length === 0) {
          console.warn('No valid badges with a badge property found in backend response.');
        }
        setEarnedBadges(validBadges);
        
        // Then trigger a check for any new badges
        console.log('Checking for new badges...');
        await API.post('/badges/check');
        console.log('Badge check completed');
        
        // Re-fetch badges to get any new ones just awarded
        ({ data } = await API.get('/badges'));
        console.log('Badges re-fetched after badge check:', data);
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('No badges returned from backend after badge check. Raw response:', data);
        } else {
          data.forEach((badgeObj, idx) => {
            console.log(`[After Check] Badge[${idx}]:`, badgeObj);
          });
        }
        validBadges = data.filter(userBadge => userBadge?.badge);
        if (validBadges.length === 0) {
          console.warn('No valid badges with a badge property found in backend response after badge check.');
        }
        setEarnedBadges(validBadges);
        
        // Categorize badges by type
        const categorized = {
          streak: [],
          journal: [],
          pack: []
        };
        validBadges.forEach(userBadge => {
          if (userBadge.badge && userBadge.badge.type) {
            categorized[userBadge.badge.type].push(userBadge);
          }
        });
        setCategorizedBadges(categorized);
      } catch (err) {
        console.error('Failed to fetch badges', err);
        console.error('Error details:', err.response?.data || err.message);
        setError('Could not load your achievements. Please try again later.');
        // If API call fails, show sample data after a short delay
        setTimeout(() => {
          if (isLoading) {
            console.log('API call failed, loading sample data');
            loadSampleBadges();
          }
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBadges();
  }, []);

  const renderIcon = (iconName) => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.Award;
    return <IconComponent className="w-12 h-12 text-cta-orange" />;
  };
  
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'streak':
        return <LucideIcons.Flame className="w-8 h-8 text-primary-blue" />;
      case 'journal':
        return <LucideIcons.BookOpen className="w-8 h-8 text-primary-blue" />;
      case 'pack':
        return <LucideIcons.Package className="w-8 h-8 text-primary-blue" />;
      default:
        return <LucideIcons.Award className="w-8 h-8 text-primary-blue" />;
    }
  };
  
  const getCategoryTitle = (category) => {
    switch(category) {
      case 'streak':
        return 'Consistency Streaks';
      case 'journal':
        return 'Journaling Achievements';
      case 'pack':
        return 'Habit Pack Completions';
      default:
        return 'Achievements';
    }
  };
  
  const getCategoryDescription = (category) => {
    switch(category) {
      case 'streak':
        return 'Badges earned by maintaining consistent daily practice.';
      case 'journal':
        return 'Rewards for your dedication to journaling and reflection.';
      case 'pack':
        return 'Recognition for completing habit packs and growing your skills.';
      default:
        return 'Your achievements on your mental fitness journey.';
    }
  };

  // Check if we're displaying sample data
  const isSampleData = earnedBadges.length > 0 && earnedBadges[0].isSample === true;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <LucideIcons.Award className="w-10 h-10 text-primary-blue" />
            <h1 className="text-4xl font-bold text-primary-text">My Achievements</h1>
          </div>
          <p className="text-lg text-primary-text text-opacity-80 mb-8">
            Here are all the badges you've earned by staying consistent with your mental fitness journey. Keep up the great work!
          </p>

          {isSampleData && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Sample Achievements</p>
                  <p>You're viewing sample achievement data. Complete activities to earn real badges!</p>
                </div>
                <button 
                  onClick={() => {
                    // Clear sample data and fetch real data again
                    setEarnedBadges([]);
                    setCategorizedBadges({ streak: [], journal: [], pack: [] });
                    setError(null);
                    setIsLoading(true);
                    // Attempt to fetch badges again
                    const fetchBadges = async () => {
                      try {
                        const { data } = await API.get('/badges');
                        const validBadges = data.filter(userBadge => userBadge?.badge);
                        setEarnedBadges(validBadges);
                        await API.post('/badges/check');
                        
                        const categorized = { streak: [], journal: [], pack: [] };
                        validBadges.forEach(userBadge => {
                          if (userBadge.badge && userBadge.badge.type) {
                            categorized[userBadge.badge.type].push(userBadge);
                          }
                        });
                        setCategorizedBadges(categorized);
                      } catch (err) {
                        console.error('Failed to fetch badges', err);
                        setError('Could not load your achievements. Please try again later.');
                      } finally {
                        setIsLoading(false);
                      }
                    };
                    fetchBadges();
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  Return to Real Data
                </button>
              </div>
            </div>
          )}

          {isLoading && <p className="text-center">Loading your achievements...</p>}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={loadSampleBadges}
                className="bg-cta-orange text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                View Sample Achievements
              </button>
            </div>
          )}

          {!isLoading && !error && (
              <div className="space-y-12">
                {earnedBadges.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="mb-4">You haven't earned any achievements yet.</p>
                    <button 
                      onClick={loadSampleBadges}
                      className="bg-cta-orange text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                    >
                      View Sample Achievements
                    </button>
                  </div>
                ) : (
                  Object.entries(categorizedBadges).map(([category, badges]) => (
                  <div key={category} className="mb-10">
                    <div className="flex items-center space-x-3 mb-4">
                      {getCategoryIcon(category)}
                      <h2 className="text-2xl font-bold text-primary-text">{getCategoryTitle(category)}</h2>
                    </div>
                    <p className="text-primary-text text-opacity-80 mb-6">
                      {getCategoryDescription(category)}
                    </p>
                    
                    {badges.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {badges.map((userBadge, index) => {
                          if (!userBadge || !userBadge.badge) {
                            return null; // Skip invalid badges
                          }
                          
                          const badge = userBadge.badge;
                          const icon = badge.iconName || 'Award';
                          const name = badge.name || 'Unknown Badge';
                          const description = badge.description || 'No description available';
                          const earnedDate = userBadge.earnedAt ? new Date(userBadge.earnedAt).toLocaleDateString() : 'Unknown date';
                          
                          return (
                            <div
                              key={userBadge._id || `fallback-${category}-${index}`}
                              className="bg-white p-6 rounded-lg shadow-md border border-border-gray text-center flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
                            >
                              <div className="mb-4">{renderIcon(icon)}</div>
                              <h3 className="text-xl font-bold text-primary-text">{name}</h3>
                              <p className="text-primary-text text-opacity-70 mt-1">{description}</p>
                              <p className="text-xs text-gray-500 mt-3">Earned on: {earnedDate}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray text-center">
                        <p className="text-primary-text text-opacity-70">
                          No {getCategoryTitle(category).toLowerCase()} badges earned yet. Keep going!
                        </p>
                      </div>
                    )}
                  </div>
                )))
              }
        
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AchievementsPage;
