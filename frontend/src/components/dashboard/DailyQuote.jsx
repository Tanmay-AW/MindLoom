import React, { useState, useEffect } from 'react';

const quotes = [
  "The best way to get started is to quit talking and begin doing.",
  "The secret of getting ahead is getting started.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Your calm mind is the ultimate weapon against your challenges.",
  "The journey of a thousand miles begins with a single step."
];

const DailyQuote = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Select a new quote each day based on the day of the year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-border-gray mt-8 text-center">
      <p className="text-lg italic text-primary-text">"{quote}"</p>
    </div>
  );
};

export default DailyQuote;
