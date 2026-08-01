import mongoose from 'mongoose';
import { config } from '../config/index.js';

export let lastConnectionError: string | null = null;

const CONNECT_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;

export async function connectDB(): Promise<void> {
  for (let attempt = 1; attempt <= CONNECT_ATTEMPTS; attempt += 1) {
    try {
      await mongoose.connect(config.mongodbUri, {
        serverSelectionTimeoutMS: 10000,
      });
      lastConnectionError = null;
      console.log(`MongoDB connected successfully (attempt ${attempt}/${CONNECT_ATTEMPTS})`);
      return;
    } catch (error) {
      lastConnectionError = error instanceof Error ? error.message : String(error);
      console.error(`MongoDB connection failed (attempt ${attempt}/${CONNECT_ATTEMPTS}):`, error);
      if (attempt < CONNECT_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }
  throw new Error(`Could not connect to MongoDB after ${CONNECT_ATTEMPTS} attempts: ${lastConnectionError}`);
}
