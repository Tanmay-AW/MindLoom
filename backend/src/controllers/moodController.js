import asyncHandler from 'express-async-handler';
import MoodLog from '../models/moodLogModel.js';
import JournalEntry from '../models/journalEntryModel.js'; // Import JournalEntry model

// ... (addMoodLog and getTodaysMoodLog functions remain the same)
const addMoodLog = asyncHandler(async (req, res) => { /* ... */ });
const getTodaysMoodLog = asyncHandler(async (req, res) => { /* ... */ });

// @desc    Get all mood logs for the logged-in user, with associated journal entries
// @route   GET /api/moods
// @access  Private
const getMoodHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch both mood logs and journal entries in parallel
  const [moodLogs, journalEntries] = await Promise.all([
    MoodLog.find({ user: userId }).sort({ createdAt: 'asc' }),
    JournalEntry.find({ user: userId })
  ]);

  // Create a map of journal entries for quick lookup by date
  const journalMap = new Map();
  journalEntries.forEach(entry => {
    const dateKey = new Date(entry.createdAt).toDateString();
    journalMap.set(dateKey, entry.content); // Store the journal content
  });

  // Combine the data
  const moodHistory = moodLogs.map(log => ({
    _id: log._id,
    mood: log.mood,
    createdAt: log.createdAt,
    journal: journalMap.get(new Date(log.createdAt).toDateString()) || null, // Attach journal if it exists
  }));

  res.json(moodHistory);
});

export { addMoodLog, getTodaysMoodLog, getMoodHistory };
