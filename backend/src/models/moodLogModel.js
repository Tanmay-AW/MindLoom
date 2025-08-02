import mongoose from 'mongoose';

const moodLogSchema = new mongoose.Schema({
  // Link to the user who created this log
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This creates a reference to the 'User' model
  },
  // The mood selected by the user (e.g., 'happy', 'calm', 'neutral')
  mood: {
    type: String,
    required: true,
  },
  // The date the mood was logged
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const MoodLog = mongoose.model('MoodLog', moodLogSchema);

export default MoodLog;
