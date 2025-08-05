import mongoose from 'mongoose';

// This sub-schema stores the user's response for a single, completed task
const taskEntrySchema = new mongoose.Schema({
  // We store a copy of the original task's ID for reference
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  taskType: {
    type: String,
    required: true,
  },
  response: {
    type: String, // Can store text, the selected option, etc.
  },
  isCorrect: { // For verifiable tasks like puzzles
    type: Boolean,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// This sub-schema represents a single day's worth of tasks for the user
const dailyTasksSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  // The specific list of tasks selected for the user for this day
  tasks: [{
    taskId: mongoose.Schema.Types.ObjectId,
    prompt: String,
    taskType: String,
    options: [String],
    // etc., we store a snapshot of the task
  }],
  // The user's completed entries for this day
  entries: [taskEntrySchema],
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const userHabitPackSchema = new mongoose.Schema({
  // Link to the user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // Link to the HabitPack template
  habitPack: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'HabitPack',
  },
  // This is now an array that stores the tasks and progress for each day
  dailyProgress: [dailyTasksSchema],
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const UserHabitPack = mongoose.model('UserHabitPack', userHabitPackSchema);

export default UserHabitPack;
