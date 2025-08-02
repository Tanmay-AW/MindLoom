import React, { useState, useEffect } from 'react';
import API from '../../api';
import CalmBotResponse from './CalmBotResponse.jsx';

const DailyPrompt = () => {
  const [promptData, setPromptData] = useState(null);
  const [response, setResponse] = useState('');
  const [reflection, setReflection] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDailyPrompt = async () => {
      try {
        const { data } = await API.get('/prompts/today');
        setPromptData(data);
      } catch (err) {
        console.error("Could not fetch today's prompt", err);
        setError('Could not load the daily prompt.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDailyPrompt();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (response.trim() === '') {
      setError('Please write a response.');
      return;
    }
    setSubmitLoading(true);
    setError('');

    try {
      const { data: entryData } = await API.post('/prompts', {
        prompt: promptData.prompt,
        response: response,
      });
      setPromptData({ ...promptData, entry: entryData });
      setSubmitLoading(false);

      setIsBotLoading(true);
      const { data: reflectionData } = await API.post('/calmbot/reflect', {
        userResponse: response,
      });
      setReflection(reflectionData.reflection);
      setIsBotLoading(false);
    } catch (err) {
      setError('Failed to save your response. Please try again.');
      setSubmitLoading(false);
      setIsBotLoading(false);
    }
  };

  // --- THIS IS THE NEW PART ---
  // Function to reset the component for re-testing
  const handleReset = () => {
    setPromptData({ ...promptData, entry: null });
    setResponse('');
    setReflection('');
    setError('');
  };
  // --- END OF NEW PART ---

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8 text-center">
        <p className="text-primary-text">Loading your daily prompt...</p>
      </div>
    );
  }

  if (promptData?.entry) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8">
        <h3 className="text-xl font-bold text-primary-text mb-2">Today's Reflection</h3>
        <p className="text-primary-text text-opacity-80 mb-4 italic">"{promptData.prompt}"</p>
        <div className="bg-background p-4 rounded-md">
          <p className="text-primary-text">{promptData.entry.response}</p>
        </div>
        
        {(isBotLoading || reflection) && (
          <CalmBotResponse isLoading={isBotLoading} reflection={reflection} />
        )}

        {/* --- THIS IS THE NEW PART --- */}
        {/* The temporary reset button for development */}
        <div className="mt-4 text-center">
          <button 
            onClick={handleReset} 
            className="text-sm text-primary-blue hover:underline"
          >
            (Dev Only) Try Again
          </button>
        </div>
        {/* --- END OF NEW PART --- */}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8">
      <form onSubmit={handleSubmit}>
        <h3 className="text-xl font-bold text-primary-text mb-2">Your Daily Prompt</h3>
        <p className="text-primary-text text-opacity-80 mb-4 italic">
          "{promptData?.prompt || 'Loading prompt...'}"
        </p>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full h-32 p-3 bg-gray-100 border border-border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all"
          placeholder="Write your thoughts here..."
        />
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitLoading}
          className="w-full mt-4 py-3 px-4 bg-cta-orange text-white font-bold rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50"
        >
          {submitLoading ? 'Saving...' : 'Save My Reflection'}
        </button>
      </form>
    </div>
  );
};

export default DailyPrompt;
