import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';

const ActiveHabitPack = () => {
  const [activePack, setActivePack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchActivePack = async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get('/habit-packs/active');
      setActivePack(data);
    } catch (err) {
      console.error("Failed to fetch active pack", err);
      setError("Could not load your current task.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePack();
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
      await API.post('/habit-packs/submit', { response });
      await API.post('/badges/check');
      await fetchActivePack();
      setResponse('');
    } catch (err) {
      setError('Failed to submit your entry. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-6 bg-white rounded-lg shadow-md mt-8">Loading your daily task...</div>;
  }

  const habitPack = activePack?.habitPack;
  const currentDay = activePack?.currentDay;
  const taskForToday = habitPack?.tasks?.find(task => task.day === currentDay);
  const hasCompletedToday = activePack?.entries?.some(entry => entry.day === currentDay);

  if (habitPack && taskForToday) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8">
        <h3 className="text-xl font-bold text-primary-text">Active Pack: {habitPack.title}</h3>
        <p className="text-primary-text text-opacity-70">Day {currentDay} of {habitPack.duration}</p>

        {hasCompletedToday ? (
          <div className="mt-4 text-center p-6 bg-accent-green bg-opacity-10 rounded-md">
            <p className="font-semibold text-accent-green">
              Great job! You've completed your task for today. Come back tomorrow for the next one.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <p className="text-primary-text italic mb-4">
              "{taskForToday?.prompt || 'Loading prompt...'}"
            </p>
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
              {submitLoading ? 'Saving...' : `Complete Day ${currentDay}`}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8 text-center">
      <h3 className="text-xl font-bold text-primary-text">No Active Habit Pack</h3>
      <p className="mt-2 text-primary-text text-opacity-70">
        You haven't started a habit pack yet. Why not start one today?
      </p>
      <Link to="/habit-packs">
        <button className="mt-4 bg-primary-blue text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90">
          Browse Packs
        </button>
      </Link>
    </div>
  );
};

export default ActiveHabitPack;
