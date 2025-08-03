import asyncHandler from 'express-async-handler';
import BreathingLog from '../models/breathingLogModel.js';

// @desc    Log a new breathing session for the day
// @route   POST /api/breathing/log
// @access  Private
const logBreathingSession = asyncHandler(async (req, res) => {
  // We only want to log one session per day to count towards streaks/achievements
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const existingLog = await BreathingLog.findOne({
    user: req.user._id,
    createdAt: { $gte: startOfToday },
  });

  if (existingLog) {
    // If a log already exists for today, just confirm it's done.
    res.status(200).json({ message: 'Breathing session already logged for today.' });
  } else {
    // If no log exists, create a new one.
    const newLog = await BreathingLog.create({ user: req.user._id });
    res.status(201).json(newLog);
  }
});

// @desc    Check if a breathing session was completed today
// @route   GET /api/breathing/today
// @access  Private
const checkTodayBreathing = asyncHandler(async (req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const existingLog = await BreathingLog.findOne({
        user: req.user._id,
        createdAt: { $gte: startOfToday },
    });

    res.json({ completed: !!existingLog }); // Send back true or false
});

export { logBreathingSession, checkTodayBreathing };
