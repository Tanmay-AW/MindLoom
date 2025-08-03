import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  // Link to the user who wrote this entry
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // The mood the user selected for this entry
  mood: {
    type: String,
    required: true,
  },
  // The user's written journal content
  content: {
    type: String,
    required: true,
  },
  // The AI-generated reflection from CalmBot
  aiReflection: {
    type: String,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;
