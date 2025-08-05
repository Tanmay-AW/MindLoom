import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot, BarChart, Bar, Cell } from 'recharts';
import API from '../api';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import { LineChart as LineChartIcon, Calendar, Smile, Frown, Meh, TrendingUp, BarChart as BarChartIcon, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';

// --- Helper Data and Functions ---
const moodConfig = {
  'Happy': { value: 5, emoji: '😊', color: '#2ECC71', icon: Smile },
  'Calm': { value: 4, emoji: '😌', color: '#3498DB', icon: Smile },
  'Neutral': { value: 3, emoji: '😐', color: '#95A5A6', icon: Meh },
  'Anxious': { value: 2, emoji: '😟', color: '#F39C12', icon: Frown },
  'Sad': { value: 1, emoji: '😢', color: '#E74C3C', icon: Frown },
};
const valueToMood = (val) => Object.keys(moodConfig).find(key => moodConfig[key].value === val);

// Helper function to group data by week or month
const groupDataByPeriod = (data, period) => {
  console.log(`Grouping data by ${period}`, data);
  
  if (!data || data.length === 0) {
    console.log('No data to group');
    return [];
  }
  
  const groupedData = {};
  
  data.forEach(entry => {
    const date = new Date(entry.date);
    let key;
    
    if (period === 'week') {
      // Get the week number (1-52)
      const weekNumber = Math.ceil((((date - new Date(date.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
      key = `Week ${weekNumber}`;
    } else if (period === 'month') {
      // Get month name
      key = date.toLocaleString('default', { month: 'long' });
    }
    
    console.log(`Entry date: ${date}, Key: ${key}`);
    
    if (!groupedData[key]) {
      groupedData[key] = {
        period: key,
        totalValue: 0,
        count: 0,
        entries: []
      };
    }
    
    groupedData[key].totalValue += entry.moodValue;
    groupedData[key].count += 1;
    groupedData[key].entries.push(entry);
  });
  
  console.log('Grouped data:', groupedData);
  
  // Calculate averages and convert to array
  const result = Object.values(groupedData).map(group => ({
    period: group.period,
    avgMoodValue: parseFloat((group.totalValue / group.count).toFixed(1)),
    count: group.count,
    entries: group.entries
  }));
  
  console.log(`${period} result:`, result);
  return result;
};

// --- Journal Modal Component ---
const JournalModal = ({ date, journal, onClose }) => {
  if (!journal) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-primary-text mb-2">Journal Entry for {date}</h3>
        <p className="text-primary-text whitespace-pre-wrap">{journal}</p>
        <button onClick={onClose} className="mt-4 py-2 px-4 rounded-md border border-border-gray w-full">Close</button>
      </div>
    </div>
  );
};

// --- Main Timeline Page Component ---
const MoodTimelinePage = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('all'); // '7days', '30days', 'all'
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [trendData, setTrendData] = useState({
    weekly: [],
    monthly: []
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        console.log('Fetching mood history...');
        
        // Check if user is logged in
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
          console.error('No user info found in localStorage');
          setError('Please log in to view your mood timeline');
          setIsLoading(false);
          return;
        }
        
        const { data } = await API.get('/moods');
        console.log('Mood data received:', data);
        
        if (!data || data.length === 0) {
          console.log('No mood data available');
          setError('No mood data available. Try logging your mood first!');
          setIsLoading(false);
          return;
        }
        
        const formattedData = data.map(log => {
          console.log('Processing log:', log);
          return {
            date: new Date(log.createdAt),
            mood: log.mood,
            moodValue: moodConfig[log.mood]?.value || 0,
            journal: log.journal,
            color: moodConfig[log.mood]?.color || '#95A5A6',
          };
        });
        
        // Sort by date (oldest to newest)
        formattedData.sort((a, b) => a.date - b.date);
        console.log('Formatted data:', formattedData);
        
        setAllData(formattedData);
        setFilteredData(formattedData); // Initially show all data
        
        // Calculate weekly and monthly trends
        const weeklyData = groupDataByPeriod(formattedData, 'week');
        const monthlyData = groupDataByPeriod(formattedData, 'month');
        console.log('Weekly data:', weeklyData);
        console.log('Monthly data:', monthlyData);
        
        setTrendData({
          weekly: weeklyData,
          monthly: monthlyData
        });
        
        // Clear any previous errors
        setError(null);
      } catch (err) {
        console.error("Failed to fetch mood history", err);
        if (err.response) {
          console.log('Error response:', err.response);
          if (err.response.status === 401) {
            setError('Authentication error. Please log in again.');
          } else {
            setError(`Error: ${err.response.data.message || 'Failed to load mood data'}`); 
          }
        } else {
          setError('Failed to connect to the server. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMoodHistory();
  }, []);

  // Handle filtering when the user clicks a button
  useEffect(() => {
    const now = new Date();
    let dataToShow = allData;
    if (filter === '7days') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      dataToShow = allData.filter(d => d.date >= sevenDaysAgo);
    } else if (filter === '30days') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      dataToShow = allData.filter(d => d.date >= thirtyDaysAgo);
    }
    setFilteredData(dataToShow);
    
    // Update trend data based on filtered data
    if (dataToShow.length > 0) {
      setTrendData({
        weekly: groupDataByPeriod(dataToShow, 'week'),
        monthly: groupDataByPeriod(dataToShow, 'month')
      });
    }
  }, [filter, allData]);

  // --- Summary Panel Calculations ---
  const summary = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const totalValue = filteredData.reduce((sum, d) => sum + d.moodValue, 0);
    const avgValue = Math.round(totalValue / filteredData.length);
    const bestDay = filteredData.reduce((max, d) => d.moodValue > max.moodValue ? d : max, filteredData[0]);
    const toughestDay = filteredData.reduce((min, d) => d.moodValue < min.moodValue ? d : min, filteredData[0]);
    
    // Calculate trend (comparing first half to second half of the period)
    const midpoint = Math.floor(filteredData.length / 2);
    const firstHalf = filteredData.slice(0, midpoint);
    const secondHalf = filteredData.slice(midpoint);
    
    const firstHalfAvg = firstHalf.length > 0 ? 
      firstHalf.reduce((sum, d) => sum + d.moodValue, 0) / firstHalf.length : 0;
    const secondHalfAvg = secondHalf.length > 0 ? 
      secondHalf.reduce((sum, d) => sum + d.moodValue, 0) / secondHalf.length : 0;
    
    const trend = secondHalfAvg - firstHalfAvg;
    
    return {
      avgMood: valueToMood(avgValue) || 'N/A',
      avgValue: avgValue,
      bestDay: bestDay.mood,
      toughestDay: toughestDay.mood,
      trend: trend,
      trendIcon: trend > 0.5 ? ArrowUpRight : trend < -0.5 ? ArrowDownRight : ArrowRight,
      trendColor: trend > 0.5 ? '#2ECC71' : trend < -0.5 ? '#E74C3C' : '#95A5A6',
      trendText: trend > 0.5 ? 'Improving' : trend < -0.5 ? 'Declining' : 'Stable',
    };
  }, [filteredData]);

  // --- Custom Components for the Chart ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      if (viewMode === 'daily') {
        return (
          <div className="bg-white p-3 border border-border-gray rounded shadow-lg">
            <p className="font-semibold">{label}</p>
            <p style={{ color: payload[0].color }}>Mood: {valueToMood(payload[0].value)}</p>
            {payload[0].payload.journal && (
              <p className="text-xs text-gray-500 mt-1">Click to view journal entry</p>
            )}
          </div>
        );
      } else {
        // For weekly/monthly view
        return (
          <div className="bg-white p-3 border border-border-gray rounded shadow-lg">
            <p className="font-semibold">{payload[0].payload.period}</p>
            <p style={{ color: getColorForValue(payload[0].value) }}>
              Average Mood: {payload[0].value.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">{payload[0].payload.count} entries</p>
          </div>
        );
      }
    }
    return null;
  };
  
  const getColorForValue = (value) => {
    if (value >= 4.5) return moodConfig['Happy'].color;
    if (value >= 3.5) return moodConfig['Calm'].color;
    if (value >= 2.5) return moodConfig['Neutral'].color;
    if (value >= 1.5) return moodConfig['Anxious'].color;
    return moodConfig['Sad'].color;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    
    if (!payload) {
      console.log('CustomDot: No payload provided', props);
      return null;
    }
    
    console.log('CustomDot payload:', payload);
    
    if (payload.journal) { // Only make dots with journals clickable
      return (
        <g onClick={() => setSelectedEntry(payload)}>
          <Dot {...props} r={8} fillOpacity={1} style={{ cursor: 'pointer' }} />
          <circle cx={cx} cy={cy} r={8} stroke={payload.color} strokeWidth={2} fill="white" style={{ cursor: 'pointer' }} />
        </g>
      );
    }
    return <Dot {...props} />;
  };
  
  // Function to generate sample mood data for demonstration
  const generateSampleData = () => {
    console.log('Generating sample data');
    const today = new Date();
    const sampleData = [];
    
    // Generate data for the last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate a random mood (1-5)
      const moodValue = Math.floor(Math.random() * 5) + 1;
      const mood = valueToMood(moodValue);
      
      sampleData.push({
        date: date,
        mood: mood,
        moodValue: moodValue,
        journal: i % 3 === 0 ? 'Sample journal entry for this day.' : null, // Add journal entries to some days
        color: moodConfig[mood]?.color || '#95A5A6',
        isSample: true // Mark as sample data
      });
    }
    
    return sampleData;
  };
  
  // Function to load sample data
  const loadSampleData = () => {
    console.log('Loading sample data');
    const sampleData = generateSampleData();
    
    // Format the data properly
    const formattedData = sampleData.map(item => ({
      ...item,
      date: new Date(item.date), // Ensure date is a Date object
    }));
    
    // Update all the state variables
    setAllData(formattedData);
    
    // Apply current filters to the sample data
    const filtered = applyFilters(formattedData, dateRange);
    setFilteredData(filtered);
    
    // Generate trend data for weekly and monthly views
    const weeklyData = groupDataByPeriod(formattedData, 'week');
    const monthlyData = groupDataByPeriod(formattedData, 'month');
    
    setTrendData({
      weekly: weeklyData,
      monthly: monthlyData
    });
    
    setError(null);
    
    console.log('Sample data loaded:', formattedData);
    console.log('Weekly trend data:', weeklyData);
    console.log('Monthly trend data:', monthlyData);
  };
  
  // Render the appropriate chart based on view mode
  const renderChart = () => {
    console.log('Rendering chart, viewMode:', viewMode);
    console.log('Filtered data length:', filteredData.length);
    
    if (isLoading) return <p className="text-center py-16">Loading chart...</p>;
    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={loadSampleData}
            className="bg-cta-orange text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            View Sample Data
          </button>
        </div>
      );
    }
    if (filteredData.length === 0) return <p className="text-center py-16">No mood data to display for this period.</p>;
    
    if (viewMode === 'daily') {
      const chartData = filteredData.map(d => ({ 
        ...d, 
        date: d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
      }));
      console.log('Chart data for daily view:', chartData);
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 6]} hide />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="moodValue" 
              name="Mood" 
              stroke="#8884d8" 
              strokeWidth={2} 
              dot={<CustomDot />} 
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (viewMode === 'weekly') {
      console.log('Weekly trend data:', trendData.weekly);
      
      if (!trendData.weekly || trendData.weekly.length === 0) {
        return <p className="text-center py-16">No weekly data available for this period.</p>;
      }
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendData.weekly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis domain={[0, 5]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgMoodValue" name="Average Mood">
              {trendData.weekly.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorForValue(entry.avgMoodValue)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (viewMode === 'monthly') {
      console.log('Monthly trend data:', trendData.monthly);
      
      if (!trendData.monthly || trendData.monthly.length === 0) {
        return <p className="text-center py-16">No monthly data available for this period.</p>;
      }
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendData.monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis domain={[0, 5]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgMoodValue" name="Average Mood">
              {trendData.monthly.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorForValue(entry.avgMoodValue)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    return <p className="text-center py-16">No chart data available.</p>;
  };

  // Check if we're displaying sample data
  const isSampleData = useMemo(() => {
    return filteredData.length > 0 && filteredData[0].isSample === true;
  }, [filteredData]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <LineChartIcon className="w-10 h-10 text-primary-blue" />
            <h1 className="text-4xl font-bold text-primary-text">Mood Timeline</h1>
          </div>
          <p className="text-lg text-primary-text text-opacity-80 mb-8">
            Track your emotional journey and identify patterns in your mood over time.
          </p>
          
          {isSampleData && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Sample Data</p>
                  <p>You're viewing randomly generated sample data. Log your mood daily to build your personal timeline.</p>
                </div>
                <button 
                  onClick={() => {
                    // Clear sample data and fetch real data again
                    setAllData([]);
                    setFilteredData([]);
                    setTrendData({ weekly: [], monthly: [] });
                    setError(null);
                    setIsLoading(true);
                    fetchMoodHistory();
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  Return to Real Data
                </button>
              </div>
            </div>
          )}

          {/* Filter and View Mode Controls */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex space-x-2 mb-2">
              {['7days', '30days', 'all'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)} 
                  className={`py-1 px-3 rounded-full text-sm font-semibold ${filter === f ? 'bg-primary-blue text-white' : 'bg-gray-200 text-primary-text'}`}
                >
                  {f === '7days' ? 'Last 7 Days' : f === '30days' ? 'Last 30 Days' : 'All Time'}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2 mb-2">
              {[{id: 'daily', icon: LineChartIcon, label: 'Daily'}, 
                {id: 'weekly', icon: BarChartIcon, label: 'Weekly'}, 
                {id: 'monthly', icon: Calendar, label: 'Monthly'}].map(mode => (
                <button 
                  key={mode.id} 
                  onClick={() => setViewMode(mode.id)} 
                  className={`flex items-center space-x-1 py-1 px-3 rounded-full text-sm font-semibold ${viewMode === mode.id ? 'bg-cta-orange text-white' : 'bg-gray-200 text-primary-text'}`}
                >
                  <mode.icon className="w-4 h-4" />
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary Panel */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col items-center">
                {summary.avgValue ? React.createElement(moodConfig[summary.avgMood]?.icon || Meh, { className: "w-8 h-8 mb-1", style: { color: moodConfig[summary.avgMood]?.color } }) : <Meh className="w-8 h-8 mb-1" />}
                <span className="text-sm text-gray-500">Average Mood</span>
                <span className="font-bold text-lg">{summary.avgMood}</span>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col items-center">
                <Smile className="w-8 h-8 mb-1 text-green-500" />
                <span className="text-sm text-gray-500">Best Mood</span>
                <span className="font-bold text-lg">{summary.bestDay}</span>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col items-center">
                <Frown className="w-8 h-8 mb-1 text-red-500" />
                <span className="text-sm text-gray-500">Toughest Mood</span>
                <span className="font-bold text-lg">{summary.toughestDay}</span>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm text-center flex flex-col items-center">
                <summary.trendIcon className="w-8 h-8 mb-1" style={{ color: summary.trendColor }} />
                <span className="text-sm text-gray-500">Mood Trend</span>
                <span className="font-bold text-lg" style={{ color: summary.trendColor }}>{summary.trendText}</span>
              </div>
            </div>
          )}

          {/* The Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-border-gray" style={{ height: '400px' }}>
            {renderChart()}
          </div>
          
          {/* View Mode Description */}
          <div className="mt-4 text-sm text-primary-text text-opacity-70">
            {viewMode === 'daily' && (
              <p>Daily view shows your mood entries for each day. Click on data points with journal entries to read them.</p>
            )}
            {viewMode === 'weekly' && (
              <p>Weekly view shows your average mood for each week, helping you identify patterns over time.</p>
            )}
            {viewMode === 'monthly' && (
              <p>Monthly view shows your average mood for each month, perfect for tracking long-term emotional trends.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      {selectedEntry && <JournalModal date={selectedEntry.date.toLocaleDateString()} journal={selectedEntry.journal} onClose={() => setSelectedEntry(null)} />}
    </div>
  );
};

export default MoodTimelinePage;
