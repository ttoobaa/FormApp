import { api } from './client';
import type { ApiResponse, Form, FormListItem, Submission, CreateFormInput } from '../types';

export async function createForm(data: CreateFormInput): Promise<ApiResponse<Form>> {
  const response = await api.post('/admin/forms', data);
  return response.data;
}

export async function getForms(): Promise<ApiResponse<FormListItem[]>> {
  const response = await api.get('/admin/forms');
  return response.data;
}

export async function getForm(formId: string): Promise<ApiResponse<Form>> {
  const response = await api.get(`/admin/forms/${formId}`);
  return response.data;
}

export async function deleteForm(formId: string): Promise<ApiResponse<never>> {
  const response = await api.delete(`/admin/forms/${formId}`);
  return response.data;
}

export async function getSubmission(formId: string): Promise<ApiResponse<Submission>> {
  const response = await api.get(`/admin/forms/${formId}/submission`);
  return response.data;
}
