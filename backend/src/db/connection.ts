import mongoose from 'mongoose';
import { config } from '../config/index.js';

export let lastConnectionError: string | null = null;

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    lastConnectionError = null;
    console.log('MongoDB connected successfully');
  } catch (error) {
    lastConnectionError = error instanceof Error ? error.message : String(error);
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}
