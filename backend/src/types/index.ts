export interface FieldConfig {
  field_key: string;
  label: string;
  type: string;
  enabled: boolean;
  placeholder?: string;
  default_value?: unknown;
  is_required?: boolean;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
  options?: string[];
  error_message?: string;
}

export interface DynamicField {
  field_key: string;
  label: string;
  type: string;
  enabled: boolean;
  placeholder?: string;
  default_value?: unknown;
  is_required?: boolean;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
  options?: string[];
  error_message?: string;
}

export interface FormDocument {
  _id: string;
  form_id: string;
  form_token: string;
  title: string;
  description?: string;
  enabled_fields: FieldConfig[];
  dynamic_fields: DynamicField[];
  is_submitted: boolean;
  submitted_at?: Date;
  link_expiry?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SubmissionDocument {
  _id: string;
  submission_id: string;
  form_id: string;
  form_token: string;
  data: Record<string, unknown>;
  submitted_at: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
}

export interface CreateFormInput {
  title: string;
  description?: string;
  enabled_fields: FieldConfig[];
  dynamic_fields?: DynamicField[];
  link_expiry?: Date;
}

export interface FormListResponse {
  form_id: string;
  form_token: string;
  title: string;
  is_submitted: boolean;
  submitted_at?: Date | null;
  link_expiry?: Date | null;
  created_at: Date;
  status: string;
}

export interface PublicFormResponse {
  form_id: string;
  title: string;
  description?: string | null;
  enabled_fields: FieldConfig[];
  dynamic_fields: DynamicField[];
}

export interface FileUploadResponse {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url: string;
}
