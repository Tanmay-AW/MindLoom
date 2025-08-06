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
        const userInfo = localStorage.getItem('userInfo');
        console.log('Auth check:', userInfo ? 'User authenticated' : 'User not authenticated');
        
        if (!userInfo) {
          console.log('User not authenticated, showing sample data');
          loadSampleBadges();
          return;
        }
        
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
        
        console.log('Checking for new badges...');
        await API.post('/badges/check');
        console.log('Badge check completed');
        
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

  const isSampleData = earnedBadges.length > 0 && earnedBadges[0].isSample === true;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <LucideIcons.Award className="w-10 h-10 text-primary-blue" />
            <h1 className="text-4xl font-bold text-gray-800">My Achievements</h1>
          </div>
          <p className="text-lg text-gray-600 mb-12">
            Here are all the badges you've earned on your mental fitness journey. Keep up the great work!
          </p>

          {isSampleData && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8" role="alert">
              <p className="font-bold">You are viewing sample achievements.</p>
              <p>Complete activities in the app to earn your real badges!</p>
            </div>
          )}

          {isLoading && <p className="text-center text-lg text-gray-500">Loading your achievements...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!isLoading && !error && (
            <div className="space-y-12">
              {earnedBadges.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                  <LucideIcons.Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700">Your Trophy Case is Empty</h3>
                  <p className="text-gray-500 mt-2">Start a habit pack or write in your journal to earn your first badge!</p>
                </div>
              ) : (
                Object.entries(categorizedBadges).map(([category, badges]) => {
                  if (badges.length === 0) return null;

                  return (
                    <section key={category} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
                      <div className="flex items-center space-x-3 mb-2">
                        {getCategoryIcon(category)}
                        <h2 className="text-2xl font-bold text-gray-800">{getCategoryTitle(category)}</h2>
                      </div>
                      <p className="text-gray-500 mb-8">
                        {getCategoryDescription(category)}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {badges.map((userBadge, index) => {
                          if (!userBadge || !userBadge.badge) return null;
                          
                          const badge = userBadge.badge;
                          const icon = badge.iconName || 'Award';
                          const name = badge.name || 'Unknown Badge';
                          const description = badge.description || 'No description available';
                          const earnedDate = userBadge.earnedAt ? new Date(userBadge.earnedAt).toLocaleDateString() : 'Unknown date';
                          
                          return (
                            <div
                              key={userBadge._id || `fallback-${category}-${index}`}
                              className="bg-slate-50/50 p-6 rounded-lg text-center flex flex-col items-center border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            >
                              <div className="bg-orange-100 p-3 rounded-full mb-4">
                                {renderIcon(icon)}
                              </div>
                              <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                              <p className="text-gray-600 text-sm mt-1 flex-grow">{description}</p>
                              <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-slate-200 w-full">Earned: {earnedDate}</p>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )
                })
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AchievementsPage;