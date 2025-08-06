import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import HabitPack from '../models/habitPackModel.js';
import UserHabitPack from '../models/userHabitPackModel.js';

// A helper function to calculate the current day based on calendar dates
const calculateCurrentDay = (startDate, packDuration) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0); // Set to midnight

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight

  const diffTime = Math.abs(today - start);
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Use round for accuracy

  return Math.min(diffDays + 1, packDuration);
};

// ... (startPack and getAllPacks functions are unchanged)
const startPack = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const packId = req.params.id;
  console.log(`[BACKEND] 2. 'startPack' controller hit for user: ${userId}`);
  await UserHabitPack.deleteMany({ user: userId, status: 'in-progress', $or: [ { habitPack: null }, { habitPack: { $exists: false } } ] });
  let existingPack = await UserHabitPack.findOne({ user: userId, status: 'in-progress' }).populate('habitPack');
  if (existingPack && existingPack.habitPack) {
    console.log('[BACKEND] 3a. Found existing valid pack. Returning it.');
    res.status(200).json(existingPack);
    return;
  } else if (existingPack && !existingPack.habitPack) {
    await UserHabitPack.deleteOne({ _id: existingPack._id });
  }
  console.log('[BACKEND] 3b. No existing pack found. Creating a new one.');
  const packTemplate = await HabitPack.findById(packId);
  if (!packTemplate) {
    console.error('[BACKEND] ERROR: HabitPack template not found for ID:', packId);
    res.status(404);
    throw new Error('Habit pack not found.');
  }
  const breathingTask = {
    taskId: new mongoose.Types.ObjectId(),
    prompt: "Take a moment to breathe and center yourself.",
    taskType: "breathing",
  };
  const shuffledTasks = packTemplate.taskPool.sort(() => 0.5 - Math.random());
  const randomTasks = shuffledTasks.slice(0, packTemplate.tasksPerDay - 1).map(task => ({
    taskId: task._id,
    prompt: task.prompt,
    taskType: task.taskType,
    options: task.options,
    correctAnswer: task.correctAnswer,
  }));
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

const getAllPacks = asyncHandler(async (req, res) => {
  const packs = await HabitPack.find({});
  res.json(packs);
});


// GET CURRENT ACTIVE PACK & GENERATE TASKS FOR TODAY IF MISSING
const getActivePack = asyncHandler(async (req, res) => {
  // ... (this function is now correct from our previous fix)
  console.log(`[BACKEND] 7. 'getActivePack' controller hit for user: ${req.user._id}`);
  await UserHabitPack.deleteMany({ user: req.user._id, status: 'in-progress', $or: [ { habitPack: null }, { habitPack: { $exists: false } } ] });
  let activePack = await UserHabitPack.findOne({ user: req.user._id, status: 'in-progress' }).populate('habitPack');
  if (activePack && !activePack.habitPack) {
    await UserHabitPack.deleteOne({ _id: activePack._id });
    activePack = await UserHabitPack.findOne({ user: req.user._id, status: 'in-progress' }).populate('habitPack');
  }
  console.log(`[BACKEND] 7b. DB query result for active pack:`, activePack);
  if (!activePack || !activePack.habitPack) {
    console.log('[BACKEND] 7c. No valid active pack found. Returning null.');
    return res.json(null);
  }
  const currentDay = calculateCurrentDay(activePack.startDate, activePack.habitPack.duration);
  console.log(`[BACKEND] 7d. Calculated currentDay: ${currentDay}`);
  const alreadyExists = activePack.dailyProgress.some(p => p.day === currentDay);
  if (!alreadyExists) {
    console.log('[BACKEND] 7e. No tasks found for current day. Generating...');
    const breathingTask = {
      taskId: new mongoose.Types.ObjectId(),
      prompt: "Take a moment to breathe and center yourself.",
      taskType: "breathing",
    };
    const shuffled = [...activePack.habitPack.taskPool].sort(() => 0.5 - Math.random());
    const randomTasks = shuffled.slice(0, activePack.habitPack.tasksPerDay - 1).map(task => ({
      taskId: task._id,
      prompt: task.prompt,
      taskType: task.taskType,
      options: task.options,
      correctAnswer: task.correctAnswer,
    }));
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

// SUBMIT A TASK RESPONSE
const submitTaskResponse = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { taskId, response, isCorrect } = req.body;

  if (!taskId || !response) {
    res.status(400);
    throw new Error('Task ID and response are required');
  }

  const userPack = await UserHabitPack.findOne({ 
    user: userId, 
    status: 'in-progress' 
  });

  if (!userPack) {
    res.status(404);
    throw new Error('No active habit pack found');
  }

  const currentDay = calculateCurrentDay(userPack.startDate, userPack.habitPack.duration || 21);
  const dayProgress = userPack.dailyProgress.find(p => p.day === currentDay);

  if (!dayProgress) {
    res.status(404);
    throw new Error('No tasks found for today');
  }

  // ... (validation checks are unchanged)
  const taskExists = dayProgress.tasks.some(t => t.taskId.toString() === taskId);
  if (!taskExists) { res.status(404); throw new Error('Task not found for today'); }
  const alreadyCompleted = dayProgress.entries.some(e => e.taskId.toString() === taskId);
  if (alreadyCompleted) { res.status(400); throw new Error('Task already completed'); }

  const task = dayProgress.tasks.find(t => t.taskId.toString() === taskId);
  const taskType = task.taskType;

  dayProgress.entries.push({ taskId, taskType, response, isCorrect, completedAt: new Date() });

  // --- FINAL FIX HERE ---
  // First, filter out the breathing task from the daily tasks list.
  const nonBreathingTasks = dayProgress.tasks.filter(t => t.taskType !== 'breathing');
  
  // Now, check if all *non-breathing* tasks have a corresponding entry.
  const allTasksCompleted = nonBreathingTasks.every(task => 
    dayProgress.entries.some(entry => entry.taskId.toString() === task.taskId.toString())
  );

  if (allTasksCompleted) {
    dayProgress.isCompleted = true;
    console.log(`[BACKEND] All non-breathing tasks for Day ${currentDay} are complete. Setting isCompleted = true.`);
  }

  await userPack.save();

  if (allTasksCompleted) {
    try {
      const { checkAndAwardBadges } = await import('../controllers/badgeController.js');
      const mockReq = { user: { _id: req.user._id } };
      const mockRes = { json: () => {}, };
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

// ... (getDailyTasks and quitPack functions are unchanged)
const getDailyTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userPack = await UserHabitPack.findOne({ 
    user: userId, 
    status: 'in-progress' 
  }).populate('habitPack');
  if (!userPack) {
    res.status(404);
    throw new Error('No active habit pack found');
  }
  const currentDay = calculateCurrentDay(userPack.startDate, userPack.habitPack.duration || 21);
  let dayProgress = userPack.dailyProgress.find(p => p.day === currentDay);
  if (!dayProgress) {
    const breathingTask = {
      taskId: new mongoose.Types.ObjectId(),
      prompt: "Take a moment to breathe and center yourself.",
      taskType: "breathing",
    };
    const shuffled = [...userPack.habitPack.taskPool].sort(() => 0.5 - Math.random());
    const randomTasks = shuffled.slice(0, (userPack.habitPack.tasksPerDay || 4) - 1).map(task => ({
      taskId: task._id,
      prompt: task.prompt,
      taskType: task.taskType,
      options: task.options,
      correctAnswer: task.correctAnswer
    }));
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

const quitPack = asyncHandler(async (req, res) => {
  res.json({ message: "quitPack stub" });
});

export {
  getAllPacks,
  startPack,
  getDailyTasks,
  submitTaskResponse,
  getActivePack,
  quitPack,
};