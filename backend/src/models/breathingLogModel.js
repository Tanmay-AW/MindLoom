import mongoose from 'mongoose';

const breathingLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const BreathingLog = mongoose.model('BreathingLog', breathingLogSchema);

export default BreathingLog;
