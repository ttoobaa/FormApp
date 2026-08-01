import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import { connectDB, lastConnectionError } from './db/connection.js';
import adminRoutes from './routes/adminRoutes.js';
import formRoutes from './routes/formRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

connectDB().catch((error:any) => {
  console.error('MongoDB connection failed on app startup:', error);
});

app.use(helmet());

app.use(cors({
  origin: [config.frontendUrl, 'https://form-formapp2.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/admin', adminRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (_req, res) => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  res.json({
    success: true,
    data: {
      db: states[mongoose.connection.readyState] ?? 'unknown',
      dbName: mongoose.connection.name ?? null,
      lastConnectionError,
    },
  });
});

app.use(errorHandler);

export default app;
