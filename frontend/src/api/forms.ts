import { api } from './client';
import type { ApiResponse, PublicForm, Submission } from '../types';

export async function getPublicForm(token: string): Promise<ApiResponse<PublicForm>> {
  const response = await api.get(`/forms/${token}`);
  return response.data;
}

export async function submitForm(token: string, data: Record<string, unknown>): Promise<ApiResponse<Submission>> {
  const response = await api.post(`/forms/${token}/submit`, { data });
  return response.data;
}
