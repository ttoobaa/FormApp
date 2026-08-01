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

export interface Form {
  form_id: string;
  form_token: string;
  title: string;
  description?: string;
  enabled_fields: FieldConfig[];
  dynamic_fields: FieldConfig[];
  is_submitted: boolean;
  submitted_at?: string;
  link_expiry?: string;
  created_at: string;
  updated_at: string;
  status?: string;
}

export interface FormListItem {
  form_id: string;
  form_token: string;
  title: string;
  is_submitted: boolean;
  submitted_at?: string;
  link_expiry?: string;
  created_at: string;
  status: string;
}

export interface Submission {
  submission_id: string;
  form_id: string;
  data: Record<string, unknown>;
  submitted_at: string;
}

export interface PublicForm {
  form_id: string;
  title: string;
  description?: string;
  enabled_fields: FieldConfig[];
  dynamic_fields: FieldConfig[];
}

export interface CreateFormInput {
  title: string;
  description?: string;
  enabled_fields: FieldConfig[];
  dynamic_fields?: FieldConfig[];
  link_expiry?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
}
