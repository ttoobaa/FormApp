import dotenv from 'dotenv';

dotenv.config();

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error('MONGODB_URI environment variable is required');
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    submissionMax: parseInt(process.env.SUBMISSION_RATE_LIMIT_MAX || '10', 10),
  },
  fileUpload: {
    maxSize: parseInt(process.env.FILE_UPLOAD_MAX_SIZE || '5242880', 10),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(','),
  },
} as const;
