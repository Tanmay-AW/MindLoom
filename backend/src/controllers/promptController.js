import asyncHandler from 'express-async-handler';
import PromptEntry from '../models/promptEntryModel.js';

// A simple list of prompts. In a real app, this might come from a database.
const dailyPrompts = [
  "What is one thing you're grateful for today?",
  "Describe a small moment of joy you experienced recently.",
  "What is a challenge you're currently facing, and what's one small step you can take to address it?",
  "Who is someone who has had a positive impact on you lately?",
  "What is a quality you admire in yourself?",
  "Write about a place where you feel completely at peace.",
  "What's a simple pleasure you often overlook?"
];

// Function to get a consistent prompt for the current day
const getPromptForDay = () => {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  return dailyPrompts[dayOfYear % dailyPrompts.length];
};

// @desc    Get today's prompt and check if user has already responded
// @route   GET /api/prompts/today
// @access  Private
const getDailyPrompt = asyncHandler(async (req, res) => {
  const promptText = getPromptForDay();

  // Check if an entry already exists for this user and this prompt today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const existingEntry = await PromptEntry.findOne({
    user: req.user._id,
    prompt: promptText,
    createdAt: { $gte: startOfToday },
  });

  res.json({
    prompt: promptText,
    entry: existingEntry, // This will be the entry object or null
  });
});

// @desc    Submit a response for a daily prompt
// @route   POST /api/prompts
// @access  Private
const submitPromptResponse = asyncHandler(async (req, res) => {
  const { prompt, response } = req.body;

  if (!prompt || !response) {
    res.status(400);
    throw new Error('Prompt and response are required');
  }

  const promptEntry = await PromptEntry.create({
    user: req.user._id,
    prompt,
    response,
  });

  if (promptEntry) {
    res.status(201).json(promptEntry);
  } else {
    res.status(400);
    throw new Error('Invalid prompt data');
  }
});

// --- THIS IS THE NEW PART ---
// @desc    Get all prompt entries for the logged-in user
// @route   GET /api/prompts
// @access  Private
const getPromptEntries = asyncHandler(async (req, res) => {
  // Find all entries that match the user's ID and sort them by creation date (newest first)
  const entries = await PromptEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(entries);
});

export { getDailyPrompt, submitPromptResponse, getPromptEntries };
