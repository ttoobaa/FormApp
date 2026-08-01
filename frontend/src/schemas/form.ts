import { z } from 'zod';
import type { FieldConfig } from '../types';

export function buildZodSchema(fields: FieldConfig[]) {
  const schemaShape: Record<string, z.ZodType<unknown>> = {};

  for (const field of fields) {
    if (!field.enabled) continue;

    let fieldSchema: z.ZodType<unknown>;

    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email(field.error_message || 'Invalid email');
        break;
      case 'password':
      case 'confirm_password':
        fieldSchema = z.string().min(1, field.error_message || 'Password is required');
        break;
      case 'age':
      case 'latitude':
      case 'longitude':
        fieldSchema = z.coerce.number();
        if (field.min_value !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(field.min_value, field.error_message);
        }
        if (field.max_value !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).max(field.max_value, field.error_message);
        }
        break;
      case 'rating':
        fieldSchema = z.coerce.number().min(0).max(field.max_value ?? 5);
        break;
      case 'file_upload':
      case 'document':
      case 'profile_image':
      case 'attachments':
        fieldSchema = z.string().optional().or(z.literal(''));
        break;
      case 'signature':
        fieldSchema = z.string().optional().or(z.literal(''));
        break;
      case 'website_url':
        fieldSchema = z.string().url(field.error_message || 'Invalid URL');
        break;
      case 'phone_number':
        fieldSchema = z.string().regex(/^\+?[\d\s-()]+$/, field.error_message || 'Invalid phone number');
        break;
      default:
        fieldSchema = z.string();
        break;
    }

    if (field.min_length !== undefined && 'min' in fieldSchema && fieldSchema instanceof z.ZodString) {
      fieldSchema = fieldSchema.min(field.min_length, field.error_message);
    }
    if (field.max_length !== undefined && 'max' in fieldSchema && fieldSchema instanceof z.ZodString) {
      fieldSchema = fieldSchema.max(field.max_length, field.error_message);
    }
    if (field.pattern !== undefined && fieldSchema instanceof z.ZodString) {
      fieldSchema = fieldSchema.regex(new RegExp(field.pattern), field.error_message);
    }

    schemaShape[field.field_key] = field.is_required
      ? fieldSchema
      : fieldSchema.optional().or(z.literal(''));
  }

  return z.object(schemaShape).passthrough().refine(
    (data) => {
      const hasPassword = 'password' in data && 'confirm_password' in data;
      if (!hasPassword) return true;
      return data.password === data.confirm_password;
    },
    {
      message: 'Passwords do not match',
      path: ['confirm_password'],
    }
  );
}
