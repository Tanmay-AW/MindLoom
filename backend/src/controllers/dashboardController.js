import asyncHandler from 'express-async-handler';
import JournalEntry from '../models/journalEntryModel.js';
import MoodLog from '../models/moodLogModel.js';
import UserBadge from '../models/UserBadgeModel.js';

// @desc    Get aggregated stats for the user's dashboard
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // --- Calculate Date for 7 days ago ---
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // --- Run all database queries in parallel for efficiency ---
  const [entriesThisWeek, moodsThisWeek, achievementsCount] = await Promise.all([
    JournalEntry.countDocuments({ user: userId, createdAt: { $gte: sevenDaysAgo } }),
    MoodLog.find({ user: userId, createdAt: { $gte: sevenDaysAgo } }),
    UserBadge.countDocuments({ user: userId })
  ]);

  // --- Calculate Average Mood ---
  let avgMood = 'N/A';
  if (moodsThisWeek.length > 0) {
    const moodToValue = { 'Happy': 5, 'Calm': 4, 'Neutral': 3, 'Anxious': 2, 'Sad': 1 };
    const totalValue = moodsThisWeek.reduce((sum, log) => sum + (moodToValue[log.mood] || 0), 0);
    const avgValue = Math.round(totalValue / moodsThisWeek.length);
    avgMood = Object.keys(moodToValue).find(key => moodToValue[key] === avgValue) || 'Neutral';
  }

  // --- Send all stats in a single response ---
  res.json({
    entriesThisWeek,
    avgMood,
    achievementsCount,
  });
});

export { getDashboardStats };
