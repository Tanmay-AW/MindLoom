import asyncHandler from 'express-async-handler';
import HabitPack from '../models/habitPackModel.js';
import UserHabitPack from '../models/userHabitPackModel.js';

// @desc    Get all available habit packs
// @route   GET /api/habit-packs
// @access  Private
const getAllPacks = asyncHandler(async (req, res) => {
  const packs = await HabitPack.find({});
  res.json(packs);
});

// @desc    Start a new habit pack for the user
// @route   POST /api/habit-packs/:id/start
// @access  Private
const startPack = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const packId = req.params.id;

  // Check if the user already has a pack in progress
  const existingPack = await UserHabitPack.findOne({ user: userId, status: 'in-progress' });
  if (existingPack) {
    res.status(400);
    throw new Error('You already have a habit pack in progress.');
  }

  // Check if the selected pack exists
  const packExists = await HabitPack.findById(packId);
  if (!packExists) {
    res.status(404);
    throw new Error('Habit pack not found.');
  }

  // Create the new user habit pack instance
  const userHabitPack = await UserHabitPack.create({
    user: userId,
    habitPack: packId,
  });

  res.status(201).json(userHabitPack);
});

// @desc    Get the user's currently active habit pack
// @route   GET /api/habit-packs/active
// @access  Private
const getActivePack = asyncHandler(async (req, res) => {
  const activePack = await UserHabitPack.findOne({ user: req.user._id, status: 'in-progress' })
    .populate('habitPack'); // .populate() fetches the full details of the linked HabitPack

  res.json(activePack); // Will be null if no active pack is found
});

// @desc    Submit an entry for the current day of a habit pack
// @route   POST /api/habit-packs/submit
// @access  Private
const submitDailyEntry = asyncHandler(async (req, res) => {
  const { response } = req.body;
  const userId = req.user._id;

  const activePack = await UserHabitPack.findOne({ user: userId, status: 'in-progress' })
    .populate('habitPack');

  if (!activePack) {
    res.status(404);
    throw new Error('No active habit pack found.');
  }

  const currentDay = activePack.currentDay;
  const taskForToday = activePack.habitPack.tasks.find(task => task.day === currentDay);

  if (!taskForToday) {
    res.status(400);
    throw new Error('Invalid day for this pack.');
  }

  // Add the new entry
  activePack.entries.push({
    day: currentDay,
    prompt: taskForToday.prompt,
    response: response,
  });

  // Check if the pack is now complete
  if (currentDay >= activePack.habitPack.duration) {
    activePack.status = 'completed';
    activePack.completedAt = Date.now();
  } else {
    // Move to the next day
    activePack.currentDay += 1;
  }

  await activePack.save();
  res.json(activePack);
});

export { getAllPacks, startPack, getActivePack, submitDailyEntry };
