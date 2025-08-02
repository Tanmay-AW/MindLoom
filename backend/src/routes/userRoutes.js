import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// When a POST request is made to '/register', call the registerUser function
router.post('/register', registerUser);

// When a POST request is made to '/login', call the loginUser function
router.post('/login', loginUser);


export default router;
