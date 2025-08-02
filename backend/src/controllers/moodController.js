import asyncHandler from 'express-async-handler';
import MoodLog from '../models/moodLogModel.js';

// ... (addMoodLog and getTodaysMoodLog functions remain the same)
const addMoodLog = asyncHandler(async (req, res) => {
  const { mood } = req.body;
  if (!mood) {
    res.status(400);
    throw new Error('No mood provided');
  }
  const moodLog = await MoodLog.create({
    mood,
    user: req.user._id,
  });
  if (moodLog) {
    res.status(201).json(moodLog);
  } else {
    res.status(400);
    throw new Error('Invalid mood data');
  }
});

const getTodaysMoodLog = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const moodLog = await MoodLog.findOne({
    user: req.user._id,
    createdAt: {
      $gte: startOfToday,
      $lte: endOfToday,
    },
  });
  if (moodLog) {
    res.json(moodLog);
  } else {
    res.json(null);
  }
});


// --- THIS IS THE NEW PART ---
// @desc    Get all mood logs for the logged-in user
// @route   GET /api/moods
// @access  Private
const getMoodHistory = asyncHandler(async (req, res) => {
  // Find all mood logs for the user and sort them from oldest to newest
  const moodHistory = await MoodLog.find({ user: req.user._id }).sort({ createdAt: 'asc' });
  res.json(moodHistory);
});
// --- END OF NEW PART ---


// Export all three functions
export { addMoodLog, getTodaysMoodLog, getMoodHistory };
