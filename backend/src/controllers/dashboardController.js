import asyncHandler from 'express-async-handler';
import JournalEntry from '../models/journalEntryModel.js';
import MoodLog from '../models/moodLogModel.js';
import UserBadge from '../models/UserBadgeModel.js';
import UserHabitPack from '../models/userHabitPackModel.js';

// @desc    Get aggregated stats for the user's dashboard
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // --- Calculate Date for 7 days ago ---
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // --- Run all database queries in parallel for efficiency ---
  const [entriesThisWeek, moodsThisWeek, achievementsCount, userHabitPacks] = await Promise.all([
    JournalEntry.countDocuments({ user: userId, createdAt: { $gte: sevenDaysAgo } }),
    MoodLog.find({ user: userId, createdAt: { $gte: sevenDaysAgo } }),
    UserBadge.countDocuments({ user: userId }),
    UserHabitPack.find({ user: userId })
  ]);

  // --- Calculate Average Mood ---
  let avgMood = 'N/A';
  if (moodsThisWeek.length > 0) {
    const moodToValue = { 'Happy': 5, 'Calm': 4, 'Neutral': 3, 'Anxious': 2, 'Sad': 1 };
    const totalValue = moodsThisWeek.reduce((sum, log) => sum + (moodToValue[log.mood] || 0), 0);
    const avgValue = Math.round(totalValue / moodsThisWeek.length);
    avgMood = Object.keys(moodToValue).find(key => moodToValue[key] === avgValue) || 'Neutral';
  }

  // --- Calculate Habit Pack Task Completion Stats ---
  let completedTasksCount = 0;
  let activePackTitle = null;
  let activePackProgress = 0;

  if (userHabitPacks.length > 0) {
    // Find active habit pack (assuming only one can be active at a time)
    const activePack = userHabitPacks.find(pack => pack.status === 'in-progress');
    // Count all completed tasks across all packs
    userHabitPacks.forEach(pack => {
      pack.dailyProgress.forEach(day => {
        completedTasksCount += day.entries.length;
      });
    });
    // Calculate progress percentage for active pack
    if (activePack) {
      // Get the habit pack title (populate if needed)
      activePackTitle = 'Active Pack';
      // Use the full duration of the pack for progress
      const completedDays = activePack.dailyProgress.filter(day => day.isCompleted).length;
      const totalDays = activePack.habitPack && activePack.habitPack.duration ? activePack.habitPack.duration : 21;
      activePackProgress = Math.round((completedDays / totalDays) * 100);
    }
  }

  // --- Send all stats in a single response ---
  res.json({
    entriesThisWeek,
    avgMood,
    achievementsCount,
    completedTasksCount,
    activePackTitle,
    activePackProgress
  });
});

export { getDashboardStats };
