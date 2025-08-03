import express from 'express';
import { logBreathingSession, checkTodayBreathing } from '../controllers/breathingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/log').post(protect, logBreathingSession);
router.route('/today').get(protect, checkTodayBreathing);

export default router;
