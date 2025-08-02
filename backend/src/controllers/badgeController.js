import asyncHandler from 'express-async-handler';
import Badge from '../models/badgeModel.js';
import UserBadge from '../models/UserBadgeModel.js'; // Corrected filename
import MoodLog from '../models/moodLogModel.js';
import PromptEntry from '../models/promptEntryModel.js';

// @desc    Get all badges earned by the user
// @route   GET /api/badges
// @access  Private
const getMyBadges = asyncHandler(async (req, res) => {
  const userBadges = await UserBadge.find({ user: req.user._id })
    .populate('badge'); // .populate() fetches the full details of the badge template

  res.json(userBadges);
});

// @desc    Check for and award any new badges
// @route   POST /api/badges/check
// @access  Private
const checkAndAwardBadges = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // --- 1. Check Streak Badges ---
  const allStreakBadges = await Badge.find({ type: 'streak' });
  const userBadges = await UserBadge.find({ user: userId }).select('badge');
  const earnedBadgeIds = userBadges.map(ub => ub.badge.toString());

  // Calculate current streak (simplified logic, for a real app this would be more robust)
  const moodLogs = await MoodLog.countDocuments({ user: userId });
  const promptEntries = await PromptEntry.countDocuments({ user: userId });
  const currentStreak = moodLogs + promptEntries; // This is a placeholder for real streak logic

  for (const streakBadge of allStreakBadges) {
    // Check if user has NOT already earned this badge AND meets the requirement
    if (!earnedBadgeIds.includes(streakBadge._id.toString()) && currentStreak >= streakBadge.requirement) {
      await UserBadge.create({
        user: userId,
        badge: streakBadge._id,
      });
      console.log(`Awarded streak badge "${streakBadge.name}" to user ${userId}`);
    }
  }
  
  // --- 2. Check for other badge types (e.g., Journal, Pack completion) can be added here ---


  // After checking, return the user's full list of badges
  const updatedUserBadges = await UserBadge.find({ user: userId }).populate('badge');
  res.json(updatedUserBadges);
});

export { getMyBadges, checkAndAwardBadges };
