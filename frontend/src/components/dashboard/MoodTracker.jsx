import React, { useState } from 'react';
import API from '../../api';

const moods = [
  { name: 'Happy', emoji: '😊' },
  { name: 'Calm', emoji: '😌' },
  { name: 'Neutral', emoji: '😐' },
  { name: 'Sad', emoji: '😢' },
  { name: 'Anxious', emoji: '😟' },
];

// It now accepts a prop called 'onMoodLogged'
const MoodTracker = ({ onMoodLogged }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      setError('Please select a mood first.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/moods', { mood: selectedMood.name });
      // --- THIS IS THE NEW PART ---
      // Call the function passed from the parent to update the flow
      if (onMoodLogged) {
        onMoodLogged(data);
      }
      // --- END OF NEW PART ---
    } catch (err) {
      setError('Failed to log mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8">
      <h3 className="text-xl font-bold text-primary-text mb-4">Step 1: How are you feeling today?</h3>
      <div className="flex justify-around items-center mb-6">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => handleMoodSelect(mood)}
            className={`text-4xl p-3 rounded-full transition-all duration-200 ${
              selectedMood?.name === mood.name
                ? 'bg-primary-blue bg-opacity-20 scale-110'
                : 'hover:bg-gray-200'
            }`}
            title={mood.name}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!selectedMood || loading}
        className="w-full py-3 px-4 bg-cta-orange text-white font-bold rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging...' : 'Log My Mood'}
      </button>

      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
    </div>
  );
};

export default MoodTracker;
