import React, { useState } from 'react';
import API from '../../api';
import { CheckCircle } from 'lucide-react';

const MultipleChoiceTask = ({ task, onComplete, isCompleted }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = async () => {
    if (!selectedOption) return;
    setIsLoading(true);
    try {
      const response = await API.post('/habit-packs/submit-task', { 
        taskId: task.taskId, 
        response: selectedOption,
        isCorrect: selectedOption === task.correctAnswer
      });
      
      setIsCorrect(selectedOption === task.correctAnswer);
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
      <div className="space-y-2">
        {task.options && task.options.map((option, index) => (
          <div 
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`p-3 rounded-md cursor-pointer transition-all ${selectedOption === option ? 'bg-primary-blue text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {option}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={isLoading || !selectedOption}
        className="w-full mt-3 py-2 px-4 bg-primary-blue text-white font-bold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Submit'}
      </button>
    </div>
  );
};

export default MultipleChoiceTask;