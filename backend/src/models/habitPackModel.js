import mongoose from 'mongoose';

// This sub-schema defines the structure for each day within a pack
const dailyTaskSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
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
  duration: { // How many days the pack lasts
    type: Number,
    required: true,
  },
  // An array of daily tasks, one for each day of the pack
  tasks: [dailyTaskSchema],
}, {
  timestamps: true,
});

const HabitPack = mongoose.model('HabitPack', habitPackSchema);

export default HabitPack;
