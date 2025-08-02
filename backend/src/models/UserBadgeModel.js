import mongoose from 'mongoose';

const userBadgeSchema = new mongoose.Schema({
  // Link to the user who earned this badge
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // Link to the specific Badge template that was earned
  badge: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Badge',
  },
  // The date the badge was earned
  earnedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// To prevent a user from earning the exact same badge multiple times,
// we create a compound index that ensures the combination of user and badge is unique.
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

const UserBadge = mongoose.model('UserBadge', userBadgeSchema);

export default UserBadge;
