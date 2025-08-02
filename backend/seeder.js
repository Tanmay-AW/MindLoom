import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import data
import { packs } from './data/habitPacks.js';
import { badges } from './data/badges.js';

// Import models
import HabitPack from './src/models/habitPackModel.js';
import Badge from './src/models/badgeModel.js';
import User from './src/models/userModel.js';

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

    // Insert new data
    await HabitPack.insertMany(packs);
    await Badge.insertMany(badges);

    console.log('Data Imported!');
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
    // You could also clear other collections here if needed
    console.log('Data Destroyed!');
    process.exit();
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
