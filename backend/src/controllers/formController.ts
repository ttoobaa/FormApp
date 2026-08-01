import { Request, Response } from 'express';
import * as formService from '../services/formService.js';
import type { ApiResponse } from '../types/index.js';

export async function getPublicForm(req: Request, res: Response) {
  try {
    const token = req.params.token as string;
    const form = await formService.getPublicForm(token);

    if (!form) {
      res.status(404).json({
        success: false,
        message: 'Form not found',
      } satisfies ApiResponse<never>);
      return;
    }

    res.json({
      success: true,
      message: 'Form retrieved successfully',
      data: form,
    } satisfies ApiResponse<typeof form>);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error: error.message,
      } satisfies ApiResponse<never>);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve form',
        error,
      } satisfies ApiResponse<never>);
    }
  }
}

export async function submitForm(req: Request, res: Response) {
  try {
    const token = req.params.token as string;
    const result = await formService.submitForm(token, req.body.data);

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: result,
    } satisfies ApiResponse<typeof result>);
  } catch (error) {
    if (error instanceof Error) {
      const statusCode = error.message === 'Invalid form token' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message,
      } satisfies ApiResponse<never>);
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to submit form',
        error,
      } satisfies ApiResponse<never>);
    }
  }
}
