import express from 'express';
import { getRecentActivity } from '../controllers/recentActivityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getRecentActivity);

export default router;
