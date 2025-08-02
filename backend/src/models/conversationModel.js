import mongoose from 'mongoose';

// This sub-schema defines the structure of a single message within a conversation
const messageSchema = new mongoose.Schema({
  // 'user' for messages from the human, 'model' for messages from the AI (CalmBot)
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true,
  },
  // The actual text content of the message
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt to each message
});

// This is the main schema for an entire conversation
const conversationSchema = new mongoose.Schema({
  // Link to the user who is having this conversation
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // An array that will hold all the messages in the chat, following the messageSchema structure
  messages: [messageSchema],
}, {
  timestamps: true, // Adds createdAt and updatedAt to the overall conversation
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
