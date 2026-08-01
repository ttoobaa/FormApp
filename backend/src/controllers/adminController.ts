import { Request, Response } from 'express';
import * as formService from '../services/formService';
import type { ApiResponse } from '../types';

export async function createForm(req: Request, res: Response) {
  try {
    const result = await formService.createForm(req.body);
    res.status(201).json({
      success: true,
      message: 'Form created successfully',
      data: result,
    } satisfies ApiResponse<typeof result>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create form',
      error: error instanceof Error ? error.message : String(error),
    } satisfies ApiResponse<never>);
  }
}

export async function getAllForms(_req: Request, res: Response) {
  try {
    const forms = await formService.getAllForms();
    res.json({
      success: true,
      message: 'Forms retrieved successfully',
      data: forms,
    } satisfies ApiResponse<typeof forms>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve forms',
      error: error instanceof Error ? error.message : String(error),
    } satisfies ApiResponse<never>);
  }
}

export async function getFormById(req: Request, res: Response) {
  try {
    const formId = req.params.formId as string;
    const form = await formService.getFormById(formId);

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
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve form',
      error: error instanceof Error ? error.message : String(error),
    } satisfies ApiResponse<never>);
  }
}

export async function deleteForm(req: Request, res: Response) {
  try {
    const formId = req.params.formId as string;
    const deleted = await formService.deleteForm(formId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Form not found',
      } satisfies ApiResponse<never>);
      return;
    }

    res.json({
      success: true,
      message: 'Form deleted successfully',
    } satisfies ApiResponse<never>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete form',
      error: error instanceof Error ? error.message : String(error),
    } satisfies ApiResponse<never>);
  }
}

export async function getSubmission(req: Request, res: Response) {
  try {
    const formId = req.params.formId as string;
    const submission = await formService.getSubmission(formId);

    if (!submission) {
      res.status(404).json({
        success: false,
        message: 'No submission found for this form',
      } satisfies ApiResponse<never>);
      return;
    }

    res.json({
      success: true,
      message: 'Submission retrieved successfully',
      data: submission,
    } satisfies ApiResponse<typeof submission>);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve submission',
      error: error instanceof Error ? error.message : String(error),
    } satisfies ApiResponse<never>);
  }
}
