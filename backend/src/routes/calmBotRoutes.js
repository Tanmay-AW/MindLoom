import express from 'express';
// Import our new controller functions
import { getConversation, sendMessage } from '../controllers/calmBotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get the entire conversation history for a user
router.route('/conversation').get(protect, getConversation);

// Route to send a new message and get a response
router.route('/message').post(protect, sendMessage);

export default router;
