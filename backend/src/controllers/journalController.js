import asyncHandler from 'express-async-handler';
import JournalEntry from '../models/journalEntryModel.js';
import MoodLog from '../models/moodLogModel.js'; // 1. IMPORT THE MOODLOG MODEL
import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;

const initializeAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in .env file');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('Journal controller initialized. AI is ready.');
  }
};

const getJournalEntries = asyncHandler(async (req, res) => {
  const entries = await JournalEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(entries);
});

const createJournalEntry = asyncHandler(async (req, res) => {
  const { mood, content } = req.body;
  if (!mood || !content) {
    res.status(400);
    throw new Error('Mood and content are required');
  }

  // --- AI Reflection Logic (No changes here) ---
  initializeAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `You are CalmBot, a wise and empathetic mindfulness coach. A user has just shared a journal entry. Their current mood is "${mood}". Their entry is: "${content}". 
  Your goal is to provide a short, encouraging reflection (2-3 sentences) that acknowledges their mood and their writing. Be supportive and gentle.`;
  const result = await model.generateContent(prompt);
  const aiReflection = result.response.text();

  // --- Database Creation Logic (This is where the fix is) ---

  // Use Promise.all to create both entries at the same time for efficiency
  const [journalEntry, moodLog] = await Promise.all([
    // Create the Journal Entry (as before)
    JournalEntry.create({
      user: req.user._id,
      mood,
      content,
      aiReflection,
    }),
    // 2. CREATE THE MOODLOG (This was the missing part)
    MoodLog.create({
      user: req.user._id,
      mood,
    })
  ]);

  res.status(201).json(journalEntry); // Send back the journal entry as before
});

const deleteJournalEntry = asyncHandler(async (req, res) => {
  const entry = await JournalEntry.findById(req.params.id);
  if (entry && entry.user.toString() === req.user._id.toString()) {
    await entry.deleteOne();
    res.json({ message: 'Journal entry removed' });
  } else {
    res.status(404);
    throw new Error('Journal entry not found or user not authorized');
  }
});

const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const getJournalStreak = asyncHandler(async (req, res) => {
  const entries = await JournalEntry.find({ user: req.user._id }).sort({ createdAt: -1 });

  if (entries.length === 0) {
    return res.json({ streak: 0 });
  }

  const uniqueDays = [...new Set(entries.map(entry => new Date(entry.createdAt).toDateString()))]
    .map(dateString => new Date(dateString))
    .sort((a, b) => b - a);

  if (uniqueDays.length === 0) {
    return res.json({ streak: 0 });
  }

  let streak = 0;
  let today = new Date();
  const mostRecentEntryDate = uniqueDays[0];

  if (isSameDay(mostRecentEntryDate, today) || isSameDay(mostRecentEntryDate, new Date(new Date().setDate(today.getDate() - 1)))) {
    streak = 1;
    let previousDay = new Date(mostRecentEntryDate);

    for (let i = 1; i < uniqueDays.length; i++) {
      const currentEntryDate = uniqueDays[i];
      previousDay.setDate(previousDay.getDate() - 1);
      if (isSameDay(currentEntryDate, previousDay)) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  res.json({ streak });
});

export { getJournalEntries, createJournalEntry, deleteJournalEntry, getJournalStreak };
