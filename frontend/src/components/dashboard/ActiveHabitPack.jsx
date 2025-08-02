import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';

const ActiveHabitPack = ({ activePackData, onTaskComplete }) => {
  const [response, setResponse] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (response.trim() === '') {
      setError('Please write a response.');
      return;
    }
    setSubmitLoading(true);
    setError('');

    try {
      await API.post('/habit-packs/submit', { response });
      await API.post('/badges/check');
      if (onTaskComplete) onTaskComplete();
      setResponse('');
    } catch (err) {
      setError('Failed to submit your entry. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 🔐 Fallback if pack doesn't exist
  if (!activePackData || !activePackData.habitPack || !activePackData.habitPack.tasks) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8 text-center">
        <h3 className="text-xl font-bold text-primary-text">No Active Habit Pack</h3>
        <p className="mt-2 text-primary-text text-opacity-70">You haven't started a habit pack yet or it may be unavailable.</p>
        <Link to="/habit-packs">
          <button className="mt-4 bg-primary-blue text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90">
            Browse Packs
          </button>
        </Link>
      </div>
    );
  }

  const activePack = activePackData;
  const taskForToday = activePack.habitPack.tasks.find(task => task.day === activePack.currentDay);
  const hasCompletedToday = activePack.entries?.some(entry => entry.day === activePack.currentDay);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8">
      <h3 className="text-xl font-bold text-primary-text">Active Pack: {activePack.habitPack.title}</h3>
      <p className="text-primary-text text-opacity-70">Day {activePack.currentDay} of {activePack.habitPack.duration}</p>
      
      {hasCompletedToday ? (
        <div className="mt-4 text-center p-6 bg-accent-green bg-opacity-10 rounded-md">
          <p className="font-semibold text-accent-green">Great job! You've completed your task for today. Come back tomorrow for the next one.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <p className="text-primary-text italic mb-4">"{taskForToday?.prompt || 'Loading prompt...'}"</p>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full h-32 p-3 bg-gray-100 border border-border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
            placeholder="Write your reflection here..."
          />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full mt-4 py-3 px-4 bg-cta-orange text-white font-bold rounded-md hover:bg-opacity-90 disabled:opacity-50"
          >
            {submitLoading ? 'Saving...' : `Complete Day ${activePack.currentDay}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default ActiveHabitPack;
