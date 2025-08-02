import express from 'express';
// Import all three controller functions
import { getDailyPrompt, submitPromptResponse, getPromptEntries } from '../controllers/promptController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route handles GET requests to fetch all journal entries for the user
router.route('/').get(protect, getPromptEntries);

// This route handles POST requests to submit a new journal entry
router.route('/').post(protect, submitPromptResponse);

// This route handles GET requests for today's specific prompt
router.route('/today').get(protect, getDailyPrompt);

export default router;
