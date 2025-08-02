import express from 'express';
// Import all three controller functions
import { addMoodLog, getTodaysMoodLog, getMoodHistory } from '../controllers/moodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route now handles GET requests to fetch all mood logs
// and POST requests to create a new one.
router.route('/')
  .get(protect, getMoodHistory)
  .post(protect, addMoodLog);

// This route still handles GET requests for today's specific mood log
router.route('/today').get(protect, getTodaysMoodLog);

export default router;
