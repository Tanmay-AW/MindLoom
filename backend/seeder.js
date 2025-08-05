import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import all data
import { packs } from './data/habitPacks.js';
import { badges as streakBadges } from './data/badges.js';
import { journalBadges } from './data/journalBadges.js';
import { packBadges } from './data/packBadges.js';

// Import all models
import HabitPack from './src/models/habitPackModel.js';
import Badge from './src/models/badgeModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeder...');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // Clear existing data first
    await HabitPack.deleteMany();
    await Badge.deleteMany();

    const allBadges = [...streakBadges, ...journalBadges, ...packBadges];

    // Insert new data
    await HabitPack.insertMany(packs);
    await Badge.insertMany(allBadges);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await HabitPack.deleteMany();
    await Badge.deleteMany();
    console.log('Data Destroyed!');
    process.exit(1);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

run();
