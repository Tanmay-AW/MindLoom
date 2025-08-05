import express from 'express';
import {
  getAllPacks,
  startPack,
  getDailyTasks,
  submitTaskResponse,
  getActivePack,
  quitPack,
} from '../controllers/habitPackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all available pack templates
router.route('/').get(protect, getAllPacks);

// Alias route for getting all available packs
router.route('/available').get(protect, getAllPacks);

// Route to get the user's active habit pack
router.route('/active').get(protect, getActivePack);

// Route to get the user's current daily tasks
router.route('/daily-task').get(protect, getDailyTasks);

// Route to submit a response for a specific task
router.route('/submit-task').post(protect, submitTaskResponse);

// Route for a user to start a specific pack by its ID
router.route('/:id/start').post(protect, startPack);

router.route('/quit').post(protect, quitPack);

export default router;
