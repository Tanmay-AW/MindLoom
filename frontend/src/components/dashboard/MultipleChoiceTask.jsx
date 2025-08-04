import React, { useState } from 'react';

const MultipleChoiceTask = ({ task, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) return;
    setLoading(true);
    onSubmit(task.taskId, selectedOption);
  };

  return (
    <div>
      <p className="text-primary-text italic mb-4">"{task.prompt}"</p>
      <div className="space-y-2">
        {task.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`w-full text-left p-3 border rounded-md transition-colors ${selectedOption === option ? 'bg-primary-blue text-white border-primary-blue' : 'bg-gray-100 border-border-gray hover:bg-gray-200'}`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!selectedOption || loading}
        className="w-full mt-4 py-2 px-4 bg-cta-orange text-white font-bold rounded-md hover:bg-opacity-90 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default MultipleChoiceTask;
