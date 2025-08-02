import React, { useState, useEffect, useRef } from 'react';
import API from '../api';
import Navbar from '../components/layout/Navbar.jsx';
import ChatMessage from '../components/chat/ChatMessage.jsx';
import { Send } from 'lucide-react';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const { data } = await API.get('/calmbot/conversation');
        setMessages(data.messages);
      } catch (err) {
        console.error("Failed to fetch conversation", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsBotTyping(true);

    try {
      const { data } = await API.post('/calmbot/message', { message: input });
      const botMessage = { role: 'model', content: data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Failed to send message", err);
      const errorMessage = { role: 'model', content: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      {/* --- THIS IS THE FIX --- */}
      {/* We add top padding here and remove overflow-hidden */}
      <main className="flex-1 flex flex-col pt-24">
      {/* --- END OF FIX --- */}
        <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col p-4">
          {/* This container will now correctly scroll */}
          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            {isLoading ? (
              <p className="text-center text-primary-text text-opacity-70">Loading conversation...</p>
            ) : (
              messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))
            )}
            {isBotTyping && <ChatMessage message={{ role: 'model', content: 'CalmBot is typing...' }} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Talk to CalmBot..."
              className="flex-1 block w-full px-4 py-3 bg-white border border-border-gray rounded-full shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
            />
            <button
              type="submit"
              className="bg-cta-orange text-white p-3 rounded-full hover:bg-opacity-90 transition-all disabled:opacity-50"
              disabled={isBotTyping || isLoading}
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
