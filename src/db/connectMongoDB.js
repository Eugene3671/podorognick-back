import mongoose from 'mongoose';
import { Traveller } from '../models/traveller.js';
import { User } from '../models/user.js';

export const connectMongoDB = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;
    await mongoose.connect(mongoURL);
    console.log('✅ MongoDB connection established successfully');

    // синхронізуємо індекси для всіх моделей
    const models = [User, Traveller];
    for (const model of models) {
      await model.syncIndexes();
    }
    console.log('Indexes synced successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};
