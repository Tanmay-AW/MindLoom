import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all dashboard stats
router.route('/stats').get(protect, getDashboardStats);

export default router;
