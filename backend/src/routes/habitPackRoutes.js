import express from 'express';
import {
  getAllPacks,
  startPack,
  getActivePack,
  submitDailyEntry,
} from '../controllers/habitPackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all available pack templates
router.route('/').get(protect, getAllPacks);

// Route to get the user's currently active pack
router.route('/active').get(protect, getActivePack);

// Route to submit an entry for the active pack
router.route('/submit').post(protect, submitDailyEntry);

// Route for a user to start a specific pack by its ID
router.route('/:id/start').post(protect, startPack);

export default router;
