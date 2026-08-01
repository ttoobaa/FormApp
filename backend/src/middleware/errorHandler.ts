import { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/index.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err);

  if (err.message === 'Invalid form token') {
    res.status(404).json({
      success: false,
      message: err.message,
      error: err.message,
    } satisfies ApiResponse<never>);
    return;
  }

  if (err.message === 'Form has already been submitted' || err.message === 'Form link has expired') {
    res.status(400).json({
      success: false,
      message: err.message,
      error: err.message,
    } satisfies ApiResponse<never>);
    return;
  }

  if (err.message.startsWith('Field')) {
    res.status(400).json({
      success: false,
      message: err.message,
      error: err.message,
    } satisfies ApiResponse<never>);
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  } satisfies ApiResponse<never>);
}
