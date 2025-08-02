import React from 'react';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const FloatingCoachButton = () => {
  const { userInfo } = useAuth();

  // This button will only render if the user is logged in
  if (!userInfo) {
    return null;
  }

  return (
    <Link
      to="/chat"
      className="fixed bottom-6 right-6 bg-primary-blue text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 z-20"
      title="Talk to CalmBot"
    >
      <Bot className="w-8 h-8" />
    </Link>
  );
};

export default FloatingCoachButton;
