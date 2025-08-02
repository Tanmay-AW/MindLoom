import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import all routes
import userRoutes from './src/routes/userRoutes.js';
import moodRoutes from './src/routes/moodRoutes.js';
import promptRoutes from './src/routes/promptRoutes.js';
import streakRoutes from './src/routes/streakRoutes.js';
import calmBotRoutes from './src/routes/calmBotRoutes.js';
import habitPackRoutes from './src/routes/habitPackRoutes.js';
import badgeRoutes from './src/routes/badgeRoutes.js'; 

import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/calmbot', calmBotRoutes);
app.use('/api/habit-packs', habitPackRoutes);
app.use('/api/badges', badgeRoutes); 

// --- Error Middleware ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
