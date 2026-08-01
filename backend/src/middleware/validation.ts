import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import type { ApiResponse } from '../types';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof Error && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: string[]; message: string }> };
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: zodError.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        } satisfies ApiResponse<never>);
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid request body',
          error,
        } satisfies ApiResponse<never>);
      }
    }
  };
}
