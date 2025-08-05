import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';

const TaskCard = ({ title, isLocked, isComplete, children }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border transition-all duration-300 ${isLocked ? 'border-gray-200 bg-gray-50' : 'border-border-gray'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold ${isLocked ? 'text-gray-400' : 'text-primary-text'}`}>{title}</h3>
        {isComplete ? (
          <CheckCircle className="w-6 h-6 text-accent-green" />
        ) : isLocked ? (
          <Lock className="w-6 h-6 text-gray-400" />
        ) : null}
      </div>
      
      {/* The actual task content (like a text input or multiple choice) will be rendered here */}
      {!isLocked && !isComplete && (
        <div>{children}</div>
      )}
    </div>
  );
};

export default TaskCard;
