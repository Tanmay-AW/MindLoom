import express from 'express';
import {
  getJournalEntries,
  createJournalEntry,
  deleteJournalEntry,
  getJournalStreak, // 1. Import the new function
} from '../controllers/journalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for getting the journal streak
router.route('/streak').get(protect, getJournalStreak); // 2. Add the new route

router.route('/')
  .get(protect, getJournalEntries)
  .post(protect, createJournalEntry);

router.route('/:id').delete(protect, deleteJournalEntry);

export default router;
