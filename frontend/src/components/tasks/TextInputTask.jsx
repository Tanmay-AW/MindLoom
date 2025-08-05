import React, { useState } from 'react';
import API from '../../api';
import { CheckCircle } from 'lucide-react';

const TextInputTask = ({ task, onComplete, isCompleted }) => {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!response.trim()) return;
    setIsLoading(true);
    try {
      await API.post('/habit-packs/submit-task', { taskId: task.taskId, response });
      onComplete(task.taskId);
    } catch (err) {
      console.error("Failed to submit task", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
        <div className="flex items-center space-x-3 text-gray-500 p-4">
            <CheckCircle className="w-6 h-6 text-accent-green" />
            <p className="font-semibold">{task.prompt}</p>
        </div>
    );
  }

  return (
    <div>
      <p className="font-semibold text-primary-text mb-3">{task.prompt}</p>
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        className="w-full h-24 p-2 bg-gray-100 border border-border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
        placeholder="Your thoughts..."
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading || !response.trim()}
        className="w-full mt-3 py-2 px-4 bg-primary-blue text-white font-bold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Submit'}
      </button>
    </div>
  );
};

export default TextInputTask;