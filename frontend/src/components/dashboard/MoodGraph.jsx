import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../../api';

// We assign a numerical value to each mood for charting purposes
const moodToValue = {
  'Happy': 5,
  'Calm': 4,
  'Neutral': 3,
  'Anxious': 2,
  'Sad': 1,
};

const MoodGraph = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const { data } = await API.get('/moods');
        
        // Process the data into a format Recharts can understand
        const formattedData = data.map(log => ({
          // Format date to be short and readable (e.g., "Aug 2")
          date: new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          // Convert the mood string to its numerical value
          moodValue: moodToValue[log.mood] || 0, // Default to 0 if mood is not recognized
        }));
        
        setChartData(formattedData);
      } catch (err) {
        console.error("Failed to fetch mood history", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodHistory();
  }, []);

  if (isLoading) {
    return <p className="text-center">Loading your mood history...</p>;
  }

  if (chartData.length === 0) {
    return <p className="text-center text-primary-text text-opacity-70">No mood data available to display a graph yet.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-border-gray mt-8" style={{ height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            domain={[0, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(value) => Object.keys(moodToValue).find(key => moodToValue[key] === value)} // Convert numbers back to mood names
          />
          <Tooltip 
            formatter={(value) => [Object.keys(moodToValue).find(key => moodToValue[key] === value), 'Mood']} // Custom tooltip label
          />
          <Legend />
          <Line type="monotone" dataKey="moodValue" name="Mood Level" stroke="#457B9D" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodGraph;
