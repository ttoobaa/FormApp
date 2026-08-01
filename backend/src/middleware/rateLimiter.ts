import rateLimit from 'express-rate-limit';
import { config } from '../config';
import type { ApiResponse } from '../types';

export const publicFormLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  } satisfies ApiResponse<never>,
});

export const submissionLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.submissionMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submission attempts, please try again later.',
  } satisfies ApiResponse<never>,
});
