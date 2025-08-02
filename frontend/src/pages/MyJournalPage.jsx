import React, { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import { BookText } from 'lucide-react';

const MyJournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await API.get('/prompts');
        setEntries(data);
      } catch (err) {
        console.error('Failed to fetch journal entries', err);
        setError('Could not load your journal entries. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Helper function to format the date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-text mb-8">My Journal</h1>

          {isLoading && <p className="text-center">Loading your entries...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          
          {!isLoading && !error && (
            <div className="space-y-6">
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <div key={entry._id} className="bg-white p-6 rounded-lg shadow-md border border-border-gray">
                    <p className="text-sm text-primary-text text-opacity-60 mb-2">{formatDate(entry.createdAt)}</p>
                    <p className="text-primary-text italic font-semibold mb-4">"{entry.prompt}"</p>
                    <p className="text-primary-text whitespace-pre-wrap">{entry.response}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookText className="w-16 h-16 mx-auto text-border-gray" />
                  <p className="mt-4 text-primary-text text-opacity-70">You haven't written any journal entries yet.</p>
                </div>
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
