import asyncHandler from 'express-async-handler';
import HabitPack from '../models/habitPackModel.js';
import UserHabitPack from '../models/userHabitPackModel.js';

const getAllPacks = asyncHandler(async (req, res) => {
  const packs = await HabitPack.find({});
  res.json(packs);
});

const startPack = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const packId = req.params.id;
  const existingPack = await UserHabitPack.findOne({ user: userId, status: 'in-progress' });
  if (existingPack) {
    res.status(400);
    throw new Error('You already have a habit pack in progress.');
  }
  const packExists = await HabitPack.findById(packId);
  if (!packExists) {
    res.status(404);
    throw new Error('Habit pack not found.');
  }
  const userHabitPack = await UserHabitPack.create({
    user: userId,
    habitPack: packId,
  });
  res.status(201).json(userHabitPack);
});

const getActivePack = asyncHandler(async (req, res) => {
  const activePack = await UserHabitPack.findOne({ user: req.user._id, status: 'in-progress' })
    .populate('habitPack'); // This ensures the habitPack details are included
  res.json(activePack);
});

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
  activePack.entries.push({
    day: currentDay,
    prompt: taskForToday.prompt,
    response: response,
  });
  if (currentDay >= activePack.habitPack.duration) {
    activePack.status = 'completed';
    activePack.completedAt = Date.now();
  } else {
    activePack.currentDay += 1;
  }
  await activePack.save();
  res.json(activePack);
});

export { getAllPacks, startPack, getActivePack, submitDailyEntry };
