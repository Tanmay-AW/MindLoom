import express from 'express';
import { getMyBadges, checkAndAwardBadges } from '../controllers/badgeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all of a user's earned badges
router.route('/').get(protect, getMyBadges);

// Route to trigger a check for new badges
router.route('/check').post(protect, checkAndAwardBadges);

export default router;
