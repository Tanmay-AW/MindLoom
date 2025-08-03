import asyncHandler from 'express-async-handler';
import PromptEntry from '../models/promptEntryModel.js';
import UserHabitPack from '../models/userHabitPackModel.js';
import MoodLog from '../models/moodLogModel.js'; // 1. Import the MoodLog model

// @desc    Get all of a user's written entries from all sources
// @route   GET /api/journal
// @access  Private
const getAllJournalEntries = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch all data in parallel
  const [dailyPromptEntries, userHabitPacks, moodLogs] = await Promise.all([
    PromptEntry.find({ user: userId }),
    UserHabitPack.find({ user: userId }),
    MoodLog.find({ user: userId })
  ]);

  const habitPackEntries = userHabitPacks.flatMap(pack => 
    pack.entries.map(entry => ({
      _id: entry._id,
      prompt: entry.prompt,
      response: entry.response,
      createdAt: entry.completedAt,
      source: 'Habit Pack',
      parentId: pack._id 
    }))
  );

  const allEntries = [
    ...dailyPromptEntries.map(e => ({
      _id: e._id,
      prompt: e.prompt,
      response: e.response,
      createdAt: e.createdAt,
      source: 'Daily Prompt',
      parentId: null
    })),
    ...habitPackEntries,
  ];

  // --- THIS IS THE NEW PART ---
  // Create a map for quick mood lookups by date
  const moodMap = new Map();
  moodLogs.forEach(log => {
    const dateKey = new Date(log.createdAt).toDateString();
    moodMap.set(dateKey, log.mood);
  });

  // Attach the corresponding mood to each journal entry
  const entriesWithMoods = allEntries.map(entry => {
    const dateKey = new Date(entry.createdAt).toDateString();
    return {
      ...entry,
      mood: moodMap.get(dateKey) || null, // Attach the mood, or null if none was logged that day
    };
  });
  // --- END OF NEW PART ---

  entriesWithMoods.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(entriesWithMoods);
});


// The updateJournalEntry function has been removed as requested.


const deleteJournalEntry = asyncHandler(async (req, res) => {
  const { source, parentId } = req.body;
  const entryId = req.params.id;
  const userId = req.user._id;

  if (source === 'Daily Prompt') {
    const entry = await PromptEntry.findById(entryId);
    if (entry && entry.user.toString() === userId.toString()) {
      await entry.deleteOne();
      res.json({ message: 'Entry removed' });
    } else {
      res.status(404);
      throw new Error('Entry not found or user not authorized');
    }
  } else if (source === 'Habit Pack') {
    const pack = await UserHabitPack.findOne({ _id: parentId, user: userId });
    if (pack) {
      const entry = pack.entries.id(entryId);
      if (entry) {
        entry.remove();
        await pack.save();
        res.json({ message: 'Entry removed from pack' });
      } else {
        res.status(404);
        throw new Error('Sub-entry not found in pack');
      }
    } else {
      res.status(404);
      throw new Error('Habit pack not found or user not authorized');
    }
  } else {
    res.status(400);
    throw new Error('Invalid entry source');
  }
});


export { getAllJournalEntries, deleteJournalEntry };
