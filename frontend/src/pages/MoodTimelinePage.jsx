import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import API from '../api';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import { LineChart as LineChartIcon, Calendar, Smile, Frown, Meh } from 'lucide-react';

// --- Helper Data and Functions ---
const moodConfig = {
  'Happy': { value: 5, emoji: '😊', color: '#2ECC71' },
  'Calm': { value: 4, emoji: '😌', color: '#3498DB' },
  'Neutral': { value: 3, emoji: '😐', color: '#95A5A6' },
  'Anxious': { value: 2, emoji: '😟', color: '#F39C12' },
  'Sad': { value: 1, emoji: '😢', color: '#E74C3C' },
};
const valueToMood = (val) => Object.keys(moodConfig).find(key => moodConfig[key].value === val);

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const { data } = await API.get('/moods');
        const formattedData = data.map(log => ({
          date: new Date(log.createdAt),
          mood: log.mood,
          moodValue: moodConfig[log.mood]?.value || 0,
          journal: log.journal,
        }));
        setAllData(formattedData);
        setFilteredData(formattedData); // Initially show all data
      } catch (err) {
        console.error("Failed to fetch mood history", err);
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
  }, [filter, allData]);

  // --- Summary Panel Calculations ---
  const summary = useMemo(() => {
    if (filteredData.length === 0) return null;
    const totalValue = filteredData.reduce((sum, d) => sum + d.moodValue, 0);
    const avgValue = Math.round(totalValue / filteredData.length);
    const bestDay = filteredData.reduce((max, d) => d.moodValue > max.moodValue ? d : max, filteredData[0]);
    const toughestDay = filteredData.reduce((min, d) => d.moodValue < min.moodValue ? d : min, filteredData[0]);
    return {
      avgMood: valueToMood(avgValue) || 'N/A',
      bestDay: bestDay.mood,
      toughestDay: toughestDay.mood,
    };
  }, [filteredData]);

  // --- Custom Components for the Chart ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-border-gray rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          <p style={{ color: payload[0].color }}>Mood: {valueToMood(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
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
            Click on a data point to read your journal entry for that day.
          </p>

          {/* Filter Buttons */}
          <div className="flex space-x-2 mb-4">
            {['7days', '30days', 'all'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`py-1 px-3 rounded-full text-sm font-semibold ${filter === f ? 'bg-primary-blue text-white' : 'bg-gray-200 text-primary-text'}`}>
                {f === '7days' ? 'Last 7 Days' : f === '30days' ? 'Last 30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Summary Panel */}
          {summary && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center"><Meh className="mx-auto mb-1" />Avg Mood: <span className="font-bold">{summary.avgMood}</span></div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center"><Smile className="mx-auto mb-1" />Best Mood: <span className="font-bold">{summary.bestDay}</span></div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center"><Frown className="mx-auto mb-1" />Toughest Mood: <span className="font-bold">{summary.toughestDay}</span></div>
            </div>
          )}

          {/* The Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-border-gray" style={{ height: '400px' }}>
            {isLoading ? <p>Loading chart...</p> : filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData.map(d => ({ ...d, date: d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 6]} hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="moodValue" name="Mood" stroke="#8884d8" strokeWidth={2} dot={<CustomDot />} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-center pt-16">No mood data to display for this period.</p>}
          </div>
        </div>
      </main>
      <Footer />
      {selectedEntry && <JournalModal date={selectedEntry.date.toLocaleDateString()} journal={selectedEntry.journal} onClose={() => setSelectedEntry(null)} />}
    </div>
  );
};

export default MoodTimelinePage;
