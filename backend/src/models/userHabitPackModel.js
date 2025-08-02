import mongoose from 'mongoose';

// This sub-schema stores the user's response for a specific day in the pack
const dailyEntrySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const userHabitPackSchema = new mongoose.Schema({
  // Link to the user who is participating in this pack
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // Link to the specific HabitPack template they are doing
  habitPack: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'HabitPack',
  },
  // The date the user started this pack
  startDate: {
    type: Date,
    default: Date.now,
  },
  // The current day the user is on in the pack (e.g., Day 1, Day 2)
  currentDay: {
    type: Number,
    default: 1,
  },
  // An array to store all of the user's daily journal entries for this pack
  entries: [dailyEntrySchema],
  // The status of the pack for this user
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress',
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const UserHabitPack = mongoose.model('UserHabitPack', userHabitPackSchema);

export default UserHabitPack;
