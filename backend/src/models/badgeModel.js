import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  // We can store the name of a Lucide icon to be rendered on the frontend
  iconName: {
    type: String,
    required: true,
  },
  // The type of achievement (e.g., related to streaks, journaling, etc.)
  type: {
    type: String,
    enum: ['streak', 'journal', 'pack'],
    required: true,
  },
  // The value required to earn the badge (e.g., 3 for a 3-day streak)
  requirement: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;
