import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Conversation from '../models/conversationModel.js'; // Import our new Conversation model

let genAI;

// Helper function to initialize the AI client
const initializeAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in .env file');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('Conversational CalmBot controller initialized. AI is ready.');
  }
};

// @desc    Get the user's conversation history with CalmBot
// @route   GET /api/calmbot/conversation
// @access  Private
const getConversation = asyncHandler(async (req, res) => {
  // Find the conversation for the logged-in user
  const conversation = await Conversation.findOne({ user: req.user._id });

  if (conversation) {
    res.json(conversation);
  } else {
    // If no conversation exists, return an empty array of messages
    res.json({ messages: [] });
  }
});

// @desc    Send a new message to CalmBot and get a response
// @route   POST /api/calmbot/message
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400);
    throw new Error('Message content is required');
  }

  initializeAI(); // Make sure the AI is ready

  // Find the existing conversation or create a new one if it doesn't exist
  let conversation = await Conversation.findOne({ user: req.user._id });
  if (!conversation) {
    conversation = await Conversation.create({ user: req.user._id, messages: [] });
  }

  // Add the new user message to the conversation history
  conversation.messages.push({ role: 'user', content: message });

  // --- Prepare the conversation history for the Gemini API ---
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const chat = model.startChat({
    history: conversation.messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
    // We can add the system instruction here if needed, but for now, history is key
  });

  const result = await chat.sendMessage(message);
  const aiResponse = result.response.text();

  // Add CalmBot's response to the conversation history
  conversation.messages.push({ role: 'model', content: aiResponse });

  // Save the updated conversation to the database
  await conversation.save();

  // Send just the latest AI response back to the frontend
  res.status(201).json({ response: aiResponse });
});

export { getConversation, sendMessage };
