import React, { useState } from 'react';
import API from '../../api';

const moods = [
  { name: 'Happy', emoji: '😊' },
  { name: 'Calm', emoji: '😌' },
  { name: 'Neutral', emoji: '😐' },
  { name: 'Sad', emoji: '😢' },
  { name: 'Anxious', emoji: '😟' },
];

const JournalEditor = ({ onEntrySaved }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood || !content) {
      setError('Please select a mood and write something.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Save the new journal entry
      const { data: newEntry } = await API.post('/journal', {
        mood: selectedMood.name,
        content: content,
      });

      // --- THIS IS THE FIX ---
      // Step 2: After saving, immediately check for new badges
      await API.post('/badges/check');
      console.log("Checked for new badges after journal entry!");
      // --- END OF FIX ---

      // Step 3: Tell the parent page that the entry was saved
      onEntrySaved(newEntry);

    } catch (err) {
      setError('Failed to save entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8">
      <form onSubmit={handleSubmit}>
        <h3 className="text-xl font-bold text-primary-text mb-4">How are you feeling right now?</h3>
        <div className="flex justify-around items-center mb-6">
          {moods.map((mood) => (
            <button
              key={mood.name}
              type="button"
              onClick={() => setSelectedMood(mood)}
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

        <h3 className="text-xl font-bold text-primary-text mb-4">Hey! What's on your mind today?</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 p-3 bg-gray-100 border border-border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
          placeholder="Write your thoughts here..."
        />

        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-3 px-4 bg-cta-orange text-white font-bold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Entry & Get Reflection'}
        </button>
      </form>
    </div>
  );
};

export default JournalEditor;
