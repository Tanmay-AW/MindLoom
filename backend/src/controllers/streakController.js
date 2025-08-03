import asyncHandler from 'express-async-handler';
import UserHabitPack from '../models/userHabitPackModel.js';
import JournalEntry from '../models/journalEntryModel.js';

// Helper function to check if two dates are on the same day (ignoring time)
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// @desc    Get the current streak for the logged-in user
// @route   GET /api/streaks
// @access  Private
const getUserStreak = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch all potential activity sources for the user
  const habitPacks = await UserHabitPack.find({ user: userId });
  const journalEntries = await JournalEntry.find({ user: userId });

  // 2. Combine all entry dates into a single list
  const habitPackDates = habitPacks.flatMap(pack => pack.entries.map(entry => entry.completedAt));
  const journalDates = journalEntries.map(entry => entry.createdAt);
  
  const allActivityDates = [...habitPackDates, ...journalDates];

  // 3. Create a unique, sorted list of dates the user was active
  const uniqueDays = [...new Set(allActivityDates.map(date => new Date(date).toDateString()))]
    .map(dateString => new Date(dateString))
    .sort((a, b) => b - a); // Sort from most recent to oldest

  if (uniqueDays.length === 0) {
    return res.json({ streak: 0 });
  }

  // 4. Calculate the consecutive day streak
  let streak = 0;
  let today = new Date();
  
  // Check if the most recent activity was today or yesterday
  const mostRecentActivity = uniqueDays[0];
  if (isSameDay(mostRecentActivity, today) || isSameDay(mostRecentActivity, new Date(today.setDate(today.getDate() - 1)))) {
    streak = 1;
    let previousDay = new Date(mostRecentActivity);

    for (let i = 1; i < uniqueDays.length; i++) {
      const currentActivityDate = uniqueDays[i];
      previousDay.setDate(previousDay.getDate() - 1); // Move to the day before

      if (isSameDay(currentActivityDate, previousDay)) {
        streak++; // It's a consecutive day, so increment the streak
      } else {
        break; // The streak is broken
      }
    }
  }

  res.json({ streak });
});

export { getUserStreak };
