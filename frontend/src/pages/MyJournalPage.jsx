import React, { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import JournalEditor from '../components/journal/JournalEditor.jsx';
import CalmBotResponse from '../components/dashboard/CalmBotResponse.jsx';
import { BookText, PlusCircle, Trash2, Flame } from 'lucide-react';

// --- A small component for the Journal Streak ---
const JournalStreak = () => {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const { data } = await API.get('/journal/streak');
        setStreak(data.streak);
      } catch (err) {
        console.error("Failed to fetch journal streak", err);
      }
    };
    fetchStreak();
  }, []);

  return (
    <div className="flex items-center space-x-2 bg-amber-100 text-amber-800 font-semibold px-3 py-1 rounded-full text-sm">
      <Flame size={16} />
      <span>{streak}-Day Writing Streak</span>
    </div>
  );
};


const MyJournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  const moodToEmoji = { 'Happy': '😊', 'Calm': '😌', 'Neutral': '😐', 'Sad': '😢', 'Anxious': '😟' };

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const { data } = await API.get('/journal');
      setEntries(data);
    } catch (err) {
      setError('Could not load your journal entries.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleEntrySaved = (newEntry) => {
    setEntries([newEntry, ...entries]);
    setIsWriting(false);
  };

  const handleDelete = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await API.delete(`/journal/${entryId}`);
        fetchEntries();
      } catch (err) {
        setError('Failed to delete entry.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Helper to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-primary-text">My Journal</h1>
            {/* --- THIS BUTTON IS NOW FIXED --- */}
            {!isWriting && entries.length > 0 && (
              <button onClick={() => setIsWriting(true)} className="flex items-center space-x-2 py-2 px-4 bg-primary-blue text-white rounded-md hover:bg-opacity-90">
                <PlusCircle size={20} />
                <span>New Entry</span>
              </button>
            )}
          </div>

          {isWriting && <JournalEditor onEntrySaved={handleEntrySaved} />}
          
          {isLoading && <p className="text-center">Loading your entries...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          
          {!isLoading && !error && (
            <div className="space-y-6 mt-8">
              {entries.length > 0 ? (
                // Show the streak tracker only if there are entries
                <>
                  <div className="flex justify-end">
                    <JournalStreak />
                  </div>
                  {entries.map((entry) => (
                    <div key={entry._id} className="bg-white p-6 rounded-lg shadow-md border border-border-gray group">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3 mb-2">
                          <p className="text-sm text-primary-text text-opacity-60">{formatDate(entry.createdAt)}</p>
                          <span className="text-xl" title={`Mood: ${entry.mood}`}>{moodToEmoji[entry.mood]}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDelete(entry._id)} title="Delete Entry">
                            <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-primary-text whitespace-pre-wrap mb-4">{entry.content}</p>
                      <p className="text-xs text-primary-text text-opacity-50">{countWords(entry.content)} words</p>
                      {entry.aiReflection && <CalmBotResponse reflection={entry.aiReflection} isLoading={false} />}
                    </div>
                  ))}
                </>
              ) : (
                !isWriting && (
                  <div className="text-center py-12 border-2 border-dashed border-border-gray rounded-lg">
                    <BookText className="w-16 h-16 mx-auto text-border-gray" />
                    <p className="mt-4 text-primary-text text-opacity-70">You haven't written any journal entries yet.</p>
                    {/* --- THIS BUTTON IS NOW FIXED --- */}
                    <button onClick={() => setIsWriting(true)} className="mt-4 bg-cta-orange text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90">
                      Start Your First Entry
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyJournalPage;
