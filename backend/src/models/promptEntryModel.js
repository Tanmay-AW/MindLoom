import mongoose from 'mongoose';

const promptEntrySchema = new mongoose.Schema({
  // Link to the user who wrote this entry
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // The prompt (question) the user was given
  prompt: {
    type: String,
    required: true,
  },
  // The user's written response
  response: {
    type: String,
    required: true,
  },
  // The date the entry was created
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const PromptEntry = mongoose.model('PromptEntry', promptEntrySchema);

export default PromptEntry;
