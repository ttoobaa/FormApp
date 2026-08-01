import { z } from 'zod';

const fieldConfigSchema = z.object({
  field_key: z.string().min(1),
  label: z.string().min(1),
  type: z.string().min(1),
  enabled: z.boolean(),
  placeholder: z.string().optional(),
  default_value: z.unknown().optional(),
  is_required: z.boolean().optional(),
  min_length: z.number().optional(),
  max_length: z.number().optional(),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  pattern: z.string().optional(),
  options: z.array(z.string()).optional(),
  error_message: z.string().optional(),
});

export const createFormSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  enabled_fields: z.array(fieldConfigSchema).min(1),
  dynamic_fields: z.array(fieldConfigSchema).optional().default([]),
  link_expiry: z.string().datetime().optional().or(z.date().optional()),
});

export const updateFormSchema = createFormSchema.partial();
