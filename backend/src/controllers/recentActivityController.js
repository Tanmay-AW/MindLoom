import asyncHandler from 'express-async-handler';
import JournalEntry from '../models/journalEntryModel.js';
import MoodLog from '../models/moodLogModel.js';
import UserHabitPack from '../models/userHabitPackModel.js';

// @desc    Get recent activity for the dashboard
// @route   GET /api/dashboard/recent-activity
// @access  Private
const getRecentActivity = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get the 10 most recent journal entries
  const journalEntries = await JournalEntry.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('createdAt mood');

  // Get the 10 most recent mood logs
  const moodLogs = await MoodLog.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('createdAt mood');

  // Get the 10 most recent completed habit tasks
  const userPacks = await UserHabitPack.find({ user: userId });
  let taskActivities = [];
  userPacks.forEach(pack => {
    pack.dailyProgress.forEach(day => {
      day.entries.forEach(entry => {
        taskActivities.push({
          createdAt: entry.completedAt,
          type: 'task',
          title: `Completed ${entry.taskType === 'breathing' ? 'breathing exercise' : 'a task'}`
        });
      });
    });
  });
  // Sort and limit to 5 most recent
  taskActivities = taskActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // Merge and sort all activities
  const activities = [
    ...journalEntries.map(e => ({ type: 'journal', title: 'Added a journal entry', timestamp: e.createdAt })),
    ...moodLogs.map(m => ({ type: 'mood', title: `Logged mood as ${m.mood}`, timestamp: m.createdAt })),
    ...taskActivities.map(t => ({ type: 'task', title: t.title, timestamp: t.createdAt })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

  res.json({ activities });
});

export { getRecentActivity };
