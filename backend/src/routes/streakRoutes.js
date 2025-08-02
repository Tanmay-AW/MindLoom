import express from 'express';
import { getUserStreak } from '../controllers/streakController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// When a GET request is made to '/', call the getUserStreak function.
// The 'protect' middleware will run first to ensure the user is logged in.
router.route('/').get(protect, getUserStreak);

export default router;
