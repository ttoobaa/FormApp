import { Form } from '../models/Form';
import { Submission } from '../models/Submission';
import type { CreateFormInput, FormListResponse, PublicFormResponse } from '../types';
import { generateFormToken, generateFormId, generateSubmissionId } from '../utils/token';
import { sanitizeObject } from '../utils/sanitize';
import { hashPassword } from '../utils/password';
import { SYSTEM_FIELDS, FORM_STATES } from '../constants';

export async function createForm(input: CreateFormInput) {
  const form_id = generateFormId();
  const form_token = generateFormToken();

  const form = await Form.create({
    form_id,
    form_token,
    title: input.title,
    description: input.description,
    enabled_fields: input.enabled_fields,
    dynamic_fields: input.dynamic_fields ?? [],
    link_expiry: input.link_expiry ? new Date(input.link_expiry) : undefined,
  });

  return {
    form_id: form.form_id,
    form_token: form.form_token,
    title: form.title,
    created_at: form.created_at,
    link_expiry: form.link_expiry,
    public_url: `/f/${form.form_token}`,
  };
}

export async function getAllForms(): Promise<FormListResponse[]> {
  const forms = await Form.find().sort({ created_at: -1 }).lean();

  return forms.map((form) => {
    const now = new Date();
    let status: string = FORM_STATES.ACTIVE;

    if (form.is_submitted) {
      status = FORM_STATES.SUBMITTED;
    } else if (form.link_expiry && new Date(form.link_expiry) < now) {
      status = FORM_STATES.EXPIRED;
    }

    return {
      form_id: form.form_id,
      form_token: form.form_token,
      title: form.title,
      is_submitted: form.is_submitted,
      submitted_at: form.submitted_at,
      link_expiry: form.link_expiry,
      created_at: form.created_at,
      status,
    };
  });
}

export async function getFormById(formId: string) {
  const form = await Form.findOne({ form_id: formId }).lean();

  if (!form) {
    return null;
  }

  const now = new Date();
  let status: string = FORM_STATES.ACTIVE;

  if (form.is_submitted) {
    status = FORM_STATES.SUBMITTED;
  } else if (form.link_expiry && new Date(form.link_expiry) < now) {
    status = FORM_STATES.EXPIRED;
  }

  return {
    form_id: form.form_id,
    form_token: form.form_token,
    title: form.title,
    description: form.description,
    enabled_fields: form.enabled_fields,
    dynamic_fields: form.dynamic_fields,
    is_submitted: form.is_submitted,
    submitted_at: form.submitted_at ?? undefined,
    link_expiry: form.link_expiry ?? undefined,
    created_at: form.created_at,
    updated_at: form.updated_at,
    status,
  };
}

export async function deleteForm(formId: string): Promise<boolean> {
  const form = await Form.findOne({ form_id: formId });

  if (!form) {
    return false;
  }

  await Form.deleteOne({ form_id: formId });
  await Submission.deleteMany({ form_id: formId });

  return true;
}

export async function getSubmission(formId: string) {
  const submission = await Submission.findOne({ form_id: formId }).lean();

  if (!submission) {
    return null;
  }

  return {
    submission_id: submission.submission_id,
    form_id: submission.form_id,
    data: submission.data,
    submitted_at: submission.submitted_at,
  };
}

export async function getPublicForm(token: string): Promise<PublicFormResponse | null> {
  const form = await Form.findOne({ form_token: token }).lean();

  if (!form) {
    return null;
  }

  if (form.is_submitted) {
    throw new Error('Form has already been submitted');
  }

  if (form.link_expiry && new Date(form.link_expiry) < new Date()) {
    throw new Error('Form link has expired');
  }

  return {
    form_id: form.form_id,
    title: form.title,
    description: form.description,
    enabled_fields: form.enabled_fields,
    dynamic_fields: form.dynamic_fields ?? [],
  };
}

export async function submitForm(token: string, rawData: Record<string, unknown>) {
  const data = sanitizeObject(rawData);

  const form = await Form.findOne({ form_token: token }).lean();

  if (!form) {
    throw new Error('Invalid form token');
  }

  if (form.is_submitted) {
    throw new Error('Form has already been submitted');
  }

  if (form.link_expiry && new Date(form.link_expiry) < new Date()) {
    throw new Error('Form link has expired');
  }

  const enabledFieldKeys = new Set(
    form.enabled_fields.filter((f) => f.enabled).map((f) => f.field_key)
  );

  const dynamicFieldKeys = new Set(
    form.dynamic_fields.filter((f) => f.enabled).map((f) => f.field_key)
  );

  const repeatableGroupKeys = form.dynamic_fields
    .filter((f) => f.type === 'repeatable_group' && f.enabled)
    .map((f) => f.field_key);

  const allowedKeys = new Set([...enabledFieldKeys, ...dynamicFieldKeys]);

  for (const key of Object.keys(data)) {
    const isRepeatableChild = repeatableGroupKeys.some(
      (groupKey) => key.startsWith(`${groupKey}_`)
    );
    if (!allowedKeys.has(key) && !isRepeatableChild) {
      throw new Error(`Field '${key}' is not allowed`);
    }
  }

  for (const field of form.enabled_fields) {
    if (!field.enabled) continue;

    const value = data[field.field_key];

    if (field.is_required && (value === undefined || value === null || value === '')) {
      throw new Error(field.error_message ?? `Field '${field.field_key}' is required`);
    }

    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string') {
        if (field.min_length !== undefined && value.length < field.min_length) {
          throw new Error(field.error_message ?? `Field '${field.field_key}' must be at least ${field.min_length} characters`);
        }
        if (field.max_length !== undefined && value.length > field.max_length) {
          throw new Error(field.error_message ?? `Field '${field.field_key}' must be at most ${field.max_length} characters`);
        }
        if (field.pattern !== undefined) {
          const regex = new RegExp(field.pattern);
          if (!regex.test(value)) {
            throw new Error(field.error_message ?? `Field '${field.field_key}' format is invalid`);
          }
        }
      }

      if (typeof value === 'number') {
        if (field.min_value !== undefined && value < field.min_value) {
          throw new Error(field.error_message ?? `Field '${field.field_key}' must be at least ${field.min_value}`);
        }
        if (field.max_value !== undefined && value > field.max_value) {
          throw new Error(field.error_message ?? `Field '${field.field_key}' must be at most ${field.max_value}`);
        }
      }
    }
  }

  if ('password' in data && 'confirm_password' in data && data.password !== data.confirm_password) {
    throw new Error('Passwords do not match');
  }

  const processedData = { ...data };
  const passwordFields = form.enabled_fields.filter(
    (f) => f.type === 'password' || f.type === 'confirm_password'
  );

  for (const field of passwordFields) {
    if (processedData[field.field_key] && typeof processedData[field.field_key] === 'string') {
      processedData[field.field_key] = await hashPassword(processedData[field.field_key] as string);
    }
  }

  const result = await Form.findOneAndUpdate(
    { form_token: token, is_submitted: false },
    { $set: { is_submitted: true, submitted_at: new Date() } },
    { new: true }
  );

  if (!result) {
    throw new Error('Form has already been submitted');
  }

  const submissionId = generateSubmissionId();

  const submissionData: Record<string, unknown> = { ...processedData };
  for (const sysField of SYSTEM_FIELDS) {
    delete submissionData[sysField];
  }

  const submission = await Submission.create({
    submission_id: submissionId,
    form_id: form.form_id,
    form_token: token,
    data: submissionData,
    submitted_at: new Date(),
  });

  return {
    submission_id: submission.submission_id,
    form_id: submission.form_id,
    submitted_at: submission.submitted_at,
  };
}
