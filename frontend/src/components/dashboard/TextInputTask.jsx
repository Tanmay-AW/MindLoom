import React, { useState } from 'react';

const TextInputTask = ({ task, onSubmit }) => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // The parent component (DailyTaskPage) will handle the API call
    onSubmit(task.taskId, response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-primary-text italic mb-4">"{task.prompt}"</p>
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        className="w-full h-24 p-3 bg-gray-100 border border-border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
        placeholder="Write your thoughts here..."
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 py-2 px-4 bg-cta-orange text-white font-bold rounded-md hover:bg-opacity-90 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default TextInputTask;
