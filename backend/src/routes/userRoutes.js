import express from 'express';
import passport from 'passport';
import { 
  registerUser, 
  loginUser, 
  sendOtp,
  // verifyOtp is no longer needed
  googleAuthCallback
} from '../controllers/userController.js';

const router = express.Router();

// Email & Password Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
// The /verify-otp route is now removed

// Google OAuth Routes (with session disabled)
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'], 
  session: false 
}));

router.get(
  '/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login', 
    session: false 
  }),
  googleAuthCallback
);

export default router;