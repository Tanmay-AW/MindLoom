import asyncHandler from 'express-async-handler';
import Badge from '../models/badgeModel.js';
import UserBadge from '../models/UserBadgeModel.js';
import UserHabitPack from '../models/userHabitPackModel.js';
import JournalEntry from '../models/journalEntryModel.js';
import MoodLog from '../models/moodLogModel.js';

// Helper function to check if two dates are on the same day
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Helper function to calculate a streak from a list of dates
const calculateStreak = (dates) => {
  if (!dates || dates.length === 0) return 0;
  
  // Create a unique, sorted list of days the user was active
  const uniqueDays = [...new Set(dates.map(d => new Date(d).toDateString()))]
    .map(dStr => new Date(dStr))
    .sort((a, b) => b - a); // Sort from most recent to oldest

  if (uniqueDays.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  const mostRecent = uniqueDays[0];

  // The streak is only current if the last activity was today or yesterday
  if (isSameDay(mostRecent, today) || isSameDay(mostRecent, new Date(new Date().setDate(today.getDate() - 1)))) {
    streak = 1;
    let previousDay = new Date(mostRecent);

    for (let i = 1; i < uniqueDays.length; i++) {
      const current = uniqueDays[i];
      previousDay.setDate(previousDay.getDate() - 1); // Move to the day before
      if (isSameDay(current, previousDay)) {
        streak++; // It's a consecutive day, so increment
      } else {
        break; // The streak is broken
      }
    }
  }
  return streak;
};

// @desc    Get all badges earned by the user
const getMyBadges = asyncHandler(async (req, res) => {
  console.log('[BADGE] getMyBadges called for user:', req.user?._id);
  const userBadges = await UserBadge.find({ user: req.user._id }).populate('badge');
  console.log('[BADGE] getMyBadges found badges:', userBadges);
  res.json(userBadges);
});

// @desc    Check for and award any new badges
const checkAndAwardBadges = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log('[BADGE] checkAndAwardBadges called for user:', userId);

  // 1. Fetch all necessary data in parallel
  const [allBadges, earnedUserBadges, habitPacks, journalEntries, moodLogs] = await Promise.all([
    Badge.find({}),
    UserBadge.find({ user: userId }),
    UserHabitPack.find({ user: userId }),
    JournalEntry.find({ user: userId }),
    MoodLog.find({ user: userId })
  ]);
  console.log('[BADGE] Badge templates:', allBadges);
  console.log('[BADGE] Already earned badges:', earnedUserBadges);
  console.log('[BADGE] User habit packs:', habitPacks);
  console.log('[BADGE] User journal entries:', journalEntries);
  console.log('[BADGE] User mood logs:', moodLogs);

  const earnedBadgeIds = earnedUserBadges.map(ub => ub.badge.toString());

  // --- 2. Calculate and Check Daily Check-in Streaks (from MoodLogs and completed tasks) ---
  const moodLogDates = moodLogs.map(log => log.createdAt);
  const habitPackDates = habitPacks.flatMap(pack => 
    pack.dailyProgress.flatMap(day => 
      day.entries.map(entry => entry.completedAt)
    )
  );
  
  // Combine all "daily check-in" activity dates (mood logs + completed tasks)
  const allCheckInDates = [...moodLogDates, ...habitPackDates];
  const checkInStreak = calculateStreak(allCheckInDates);
  const streakBadges = allBadges.filter(b => b.type === 'streak');
  
  console.log('[BADGE] Mood log dates:', moodLogDates);
  console.log('[BADGE] Habit pack dates:', habitPackDates);
  console.log('[BADGE] All check-in dates:', allCheckInDates);
  console.log('[BADGE] Check-in streak:', checkInStreak);

  for (const badge of streakBadges) {
    if (!earnedBadgeIds.includes(badge._id.toString()) && checkInStreak >= badge.requirement) {
      console.log(`[BADGE] Awarding streak badge: ${badge.name}`);
      await UserBadge.create({ user: userId, badge: badge._id });
    }
  }

  // --- 3. Calculate and Check Journaling Streaks ---
  const journalDates = journalEntries.map(entry => entry.createdAt);
  const journalStreak = calculateStreak(journalDates);
  const journalBadges = allBadges.filter(b => b.type === 'journal');
  console.log('[BADGE] Journal streak:', journalStreak);

  for (const badge of journalBadges) {
    if (!earnedBadgeIds.includes(badge._id.toString()) && journalStreak >= badge.requirement) {
      console.log(`[BADGE] Awarding journal badge: ${badge.name}`);
      await UserBadge.create({ user: userId, badge: badge._id });
    }
  }

  // --- 4. Check for Pack Completion Badges ---
  const packBadges = allBadges.filter(b => b.type === 'pack');
  // Count the number of completed daily tasks
  const completedDays = habitPacks.reduce((total, pack) => {
    return total + pack.dailyProgress.filter(day => day.isCompleted).length;
  }, 0);
  console.log('[BADGE] Completed days for pack badges:', completedDays);
  
  for (const badge of packBadges) {
    if (!earnedBadgeIds.includes(badge._id.toString()) && completedDays >= badge.requirement) {
      console.log(`[BADGE] Awarding pack badge: ${badge.name}`);
      await UserBadge.create({ user: userId, badge: badge._id });
    }
  }

  // After checking, return the user's full list of badges
  const updatedUserBadges = await UserBadge.find({ user: userId }).populate('badge');
  console.log('[BADGE] Updated user badges:', updatedUserBadges);
  res.json(updatedUserBadges);
});

export { getMyBadges, checkAndAwardBadges };
