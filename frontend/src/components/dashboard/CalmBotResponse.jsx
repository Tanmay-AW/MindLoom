import React from 'react'; // This line was missing
import { Bot } from 'lucide-react';

const CalmBotResponse = ({ reflection, isLoading }) => {
  return (
    <div className="mt-6 bg-primary-blue bg-opacity-10 p-4 rounded-lg border border-primary-blue border-opacity-20">
      <div className="flex items-start space-x-3">
        <div className="bg-primary-blue p-2 rounded-full">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 pt-1">
          <h4 className="font-bold text-primary-blue mb-1">CalmBot says:</h4>
          {isLoading ? (
            <p className="text-primary-text text-opacity-70 italic">CalmBot is thinking...</p>
          ) : (
            <p className="text-primary-text">{reflection}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalmBotResponse;
