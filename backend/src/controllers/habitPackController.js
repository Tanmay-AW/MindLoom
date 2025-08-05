
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import HabitPack from '../models/habitPackModel.js';
import UserHabitPack from '../models/userHabitPackModel.js';

// START A PACK or RETURN EXISTING ONE
const startPack = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const packId = req.params.id;
  console.log(`[BACKEND] 2. 'startPack' controller hit for user: ${userId}`);

  // Remove any broken packs with habitPack: null or missing
  await UserHabitPack.deleteMany({ user: userId, status: 'in-progress', $or: [ { habitPack: null }, { habitPack: { $exists: false } } ] });

  // Re-query for a valid existing pack
  let existingPack = await UserHabitPack.findOne({ user: userId, status: 'in-progress' }).populate('habitPack');
  if (existingPack && existingPack.habitPack) {
    console.log('[BACKEND] 3a. Found existing valid pack. Returning it.');
    res.status(200).json(existingPack);
    return;
  } else if (existingPack && !existingPack.habitPack) {
    // Defensive: delete this broken pack and continue to create a new one
    await UserHabitPack.deleteOne({ _id: existingPack._id });
  }

  console.log('[BACKEND] 3b. No existing pack found. Creating a new one.');
  const packTemplate = await HabitPack.findById(packId);
  if (!packTemplate) {
    console.error('[BACKEND] ERROR: HabitPack template not found for ID:', packId);
    res.status(404);
    throw new Error('Habit pack not found.');
  }

  // Add a breathing exercise task first
  const breathingTask = {
    taskId: new mongoose.Types.ObjectId(),
    prompt: "Take a moment to breathe and center yourself.",
    taskType: "breathing",
  };
  
  // Shuffle the remaining tasks and select 3
  const shuffledTasks = packTemplate.taskPool.sort(() => 0.5 - Math.random());
  const randomTasks = shuffledTasks.slice(0, packTemplate.tasksPerDay - 1).map(task => ({
    taskId: task._id,
    prompt: task.prompt,
    taskType: task.taskType,
    options: task.options,
    correctAnswer: task.correctAnswer,
  }));
  
  // Combine breathing task with random tasks
  const todayTasks = [breathingTask, ...randomTasks];

  let userHabitPack = await UserHabitPack.create({
    user: userId,
    habitPack: packId,
    dailyProgress: [{ day: 1, tasks: todayTasks }],
    startDate: new Date(),
    status: 'in-progress',
  });
  userHabitPack = await userHabitPack.populate('habitPack');
  console.log('[BACKEND] 3c. New pack created in DB with status:', userHabitPack.status);
  res.status(201).json(userHabitPack);
});

// GET CURRENT ACTIVE PACK & GENERATE TASKS FOR TODAY IF MISSING
const getActivePack = asyncHandler(async (req, res) => {
  console.log(`[BACKEND] 7. 'getActivePack' controller hit for user: ${req.user._id}`);

  // Remove any broken packs with habitPack: null or missing
  await UserHabitPack.deleteMany({ user: req.user._id, status: 'in-progress', $or: [ { habitPack: null }, { habitPack: { $exists: false } } ] });

  let activePack = await UserHabitPack.findOne({ user: req.user._id, status: 'in-progress' }).populate('habitPack');

  // Defensive: if a broken pack is still found, delete and re-query
  if (activePack && !activePack.habitPack) {
    await UserHabitPack.deleteOne({ _id: activePack._id });
    activePack = await UserHabitPack.findOne({ user: req.user._id, status: 'in-progress' }).populate('habitPack');
  }

  console.log(`[BACKEND] 7b. DB query result for active pack:`, activePack);

  if (!activePack || !activePack.habitPack) {
    console.log('[BACKEND] 7c. No valid active pack found. Returning null.');
    return res.json(null);
  }

  const startDate = new Date(activePack.startDate);
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const currentDay = Math.min(diffDays + 1, activePack.habitPack.duration);
  console.log(`[BACKEND] 7d. Calculated currentDay: ${currentDay}`);

  const alreadyExists = activePack.dailyProgress.some(p => p.day === currentDay);
  if (!alreadyExists) {
    console.log('[BACKEND] 7e. No tasks found for current day. Generating...');

    // Add a breathing exercise task first
    const breathingTask = {
      taskId: new mongoose.Types.ObjectId(),
      prompt: "Take a moment to breathe and center yourself.",
      taskType: "breathing",
    };
    
    // Shuffle the remaining tasks and select 3
    const shuffled = [...activePack.habitPack.taskPool].sort(() => 0.5 - Math.random());
    const randomTasks = shuffled.slice(0, activePack.habitPack.tasksPerDay - 1).map(task => ({
      taskId: task._id,
      prompt: task.prompt,
      taskType: task.taskType,
      options: task.options,
      correctAnswer: task.correctAnswer,
    }));
    
    // Combine breathing task with random tasks
    const todayTasks = [breathingTask, ...randomTasks];

    activePack.dailyProgress.push({
      day: currentDay,
      tasks: todayTasks,
    });

    await activePack.save();
    console.log('[BACKEND] 7f. New daily tasks appended and saved.');
  }

  const responseData = activePack.toObject();
  responseData.currentDay = currentDay;

  console.log('[BACKEND] 7g. Sending response with valid active pack.');
  res.json(responseData);
});

// GET ALL PACKS
const getAllPacks = asyncHandler(async (req, res) => {
  const packs = await HabitPack.find({});
  res.json(packs);
});

// SUBMIT A TASK RESPONSE
const submitTaskResponse = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { taskId, response, isCorrect } = req.body;

  if (!taskId || !response) {
    res.status(400);
    throw new Error('Task ID and response are required');
  }

  // Find the user's active habit pack
  const userPack = await UserHabitPack.findOne({ 
    user: userId, 
    status: 'in-progress' 
  });

  if (!userPack) {
    res.status(404);
    throw new Error('No active habit pack found');
  }

  // Calculate current day
  const startDate = new Date(userPack.startDate);
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const currentDay = Math.min(diffDays + 1, userPack.habitPack.duration || 21);

  // Find the current day's progress
  const dayProgress = userPack.dailyProgress.find(p => p.day === currentDay);
  if (!dayProgress) {
    res.status(404);
    throw new Error('No tasks found for today');
  }

  // Check if the task exists for today
  const taskExists = dayProgress.tasks.some(t => t.taskId.toString() === taskId);
  if (!taskExists) {
    res.status(404);
    throw new Error('Task not found for today');
  }

  // Check if the task is already completed
  const alreadyCompleted = dayProgress.entries.some(e => e.taskId.toString() === taskId);
  if (alreadyCompleted) {
    res.status(400);
    throw new Error('Task already completed');
  }

  // Find the task to get its type
  const task = dayProgress.tasks.find(t => t.taskId.toString() === taskId);
  const taskType = task.taskType;

  // Add the entry
  dayProgress.entries.push({
    taskId,
    taskType,
    response,
    isCorrect,
    completedAt: new Date()
  });

  // Check if all tasks for the day are completed
  const allTasksCompleted = dayProgress.tasks.every(task => 
    dayProgress.entries.some(entry => entry.taskId.toString() === task.taskId.toString())
  );

  if (allTasksCompleted) {
    dayProgress.isCompleted = true;
  }

  await userPack.save();

  // If all tasks are completed, trigger badge check
  if (allTasksCompleted) {
    try {
      // Import the badge controller function
      const { checkAndAwardBadges } = await import('../controllers/badgeController.js');
      // Create a mock request and response object
      const mockReq = { user: { _id: req.user._id } };
      const mockRes = {
        json: () => {}, // Empty function as we don't need the response
      };
      // Call the badge check function
      await checkAndAwardBadges(mockReq, mockRes);
      console.log('Badge check triggered after completing all daily tasks');
    } catch (badgeErr) {
      console.error('Failed to check for badges', badgeErr);
    }
  }

  res.status(201).json({ 
    success: true, 
    message: 'Task response submitted successfully',
    allTasksCompleted
  });
});

// STUB FOR QUITTING A PACK
const quitPack = asyncHandler(async (req, res) => {
  // IMPLEMENTATION HERE
  res.json({ message: "quitPack stub" });
});

// GET DAILY TASKS
const getDailyTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find the user's active habit pack
  const userPack = await UserHabitPack.findOne({ 
    user: userId, 
    status: 'in-progress' 
  }).populate('habitPack');

  if (!userPack) {
    res.status(404);
    throw new Error('No active habit pack found');
  }

  // Calculate current day
  const startDate = new Date(userPack.startDate);
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const currentDay = Math.min(diffDays + 1, userPack.habitPack.duration || 21);

  // Find the current day's progress
  let dayProgress = userPack.dailyProgress.find(p => p.day === currentDay);

  // If no tasks for today, generate them
  if (!dayProgress) {
    // Add a breathing exercise task first
    const breathingTask = {
      taskId: new mongoose.Types.ObjectId(),
      prompt: "Take a moment to breathe and center yourself.",
      taskType: "breathing",
    };
    
    // Shuffle the remaining tasks and select 3
    const shuffled = [...userPack.habitPack.taskPool].sort(() => 0.5 - Math.random());
    const randomTasks = shuffled.slice(0, (userPack.habitPack.tasksPerDay || 4) - 1).map(task => ({
      taskId: task._id,
      prompt: task.prompt,
      taskType: task.taskType,
      options: task.options,
      correctAnswer: task.correctAnswer
    }));
    
    // Combine breathing task with random tasks
    const todayTasks = [breathingTask, ...randomTasks];

    dayProgress = {
      day: currentDay,
      tasks: todayTasks,
      entries: [],
      isCompleted: false
    };

    userPack.dailyProgress.push(dayProgress);
    await userPack.save();
  }

  res.json({
    currentDay,
    tasks: dayProgress.tasks,
    entries: dayProgress.entries,
    isCompleted: dayProgress.isCompleted
  });
});

export {
  getAllPacks,
  startPack,
  getDailyTasks,
  submitTaskResponse,
  getActivePack,
  quitPack,
};
