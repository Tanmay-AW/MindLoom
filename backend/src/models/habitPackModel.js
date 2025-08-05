import mongoose from 'mongoose';

// This is a flexible schema that can hold data for different task types
const taskSchema = new mongoose.Schema({
  taskType: {
    type: String,
    required: true,
    enum: ['breathing', 'textInput', 'multipleChoice', 'memorySequence'], // The different types of tasks we can have
  },
  prompt: {
    type: String,
    required: true,
  },
  // Optional fields that only apply to certain task types
  options: [String], // For multipleChoice
  correctAnswer: String, // For multipleChoice or other verifiable tasks
  sequence: [String], // For memorySequence
  minWords: Number, // For textInput
});

const habitPackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  // This is now a pool of all possible tasks for this pack
  taskPool: [taskSchema],
  // How many tasks to randomly select from the pool each day
  tasksPerDay: {
    type: Number,
    default: 3,
  },
  // Duration of the habit pack in days
  duration: {
    type: Number,
    default: 21, // Default to 21 days
  },
}, {
  timestamps: true,
});

const HabitPack = mongoose.model('HabitPack', habitPackSchema);

export default HabitPack;
