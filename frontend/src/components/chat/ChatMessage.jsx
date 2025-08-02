import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start space-x-4 ${isUser ? 'justify-end' : ''}`}>
      {/* Icon for CalmBot */}
      {!isUser && (
        <div className="bg-primary-blue p-2 rounded-full flex-shrink-0">
          <Bot className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Message Bubble */}
      <div 
        className={`max-w-md p-4 rounded-2xl ${
          isUser 
            ? 'bg-cta-orange text-white rounded-br-none' 
            : 'bg-gray-100 text-primary-text rounded-bl-none'
        }`}
      >
        <p>{message.content}</p>
      </div>

      {/* Icon for User */}
      {isUser && (
        <div className="bg-gray-200 p-2 rounded-full flex-shrink-0">
          <User className="w-6 h-6 text-primary-text" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
