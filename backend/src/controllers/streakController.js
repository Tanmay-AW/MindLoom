import asyncHandler from 'express-async-handler';
import UserHabitPack from '../models/userHabitPackModel.js';
import JournalEntry from '../models/journalEntryModel.js';

// Helper function to check if two dates are on the same day (ignoring time)
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false; // Safety check for invalid dates
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// @desc    Get the current streak for the logged-in user
// @route   GET /api/streaks
// @access  Private
const getUserStreak = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch all potential activity sources for the user
  const [habitPacks, journalEntries] = await Promise.all([
    UserHabitPack.find({ user: userId }),
    JournalEntry.find({ user: userId })
  ]);

  // 2. Combine all entry dates into a single list
  // --- THIS IS THE FIRST FIX: Safely handle habit pack data ---
  const habitPackDates = habitPacks.flatMap(pack => 
    pack.entries ? pack.entries.map(entry => entry.completedAt) : []
  );
  const journalDates = journalEntries.map(entry => entry.createdAt);
  
  // Filter out any null or undefined dates before processing
  const allActivityDates = [...habitPackDates, ...journalDates].filter(date => date);

  // 3. Create a unique, sorted list of dates the user was active
  const uniqueDays = [...new Set(allActivityDates.map(date => new Date(date).toDateString()))]
    .map(dateString => new Date(dateString))
    .sort((a, b) => b - a); // Sort from most recent to oldest

  if (uniqueDays.length === 0) {
    return res.json({ streak: 0 });
  }

  // 4. Calculate the consecutive day streak
  let streak = 0;
  const today = new Date();
  // --- THIS IS THE SECOND FIX: Avoid mutating the 'today' variable ---
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  // Check if the most recent activity was today or yesterday
  const mostRecentActivity = uniqueDays[0];
  if (isSameDay(mostRecentActivity, today) || isSameDay(mostRecentActivity, yesterday)) {
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
