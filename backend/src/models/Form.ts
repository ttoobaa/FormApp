import mongoose from 'mongoose';
import type { FieldConfig } from '../types';

const fieldConfigSchema = new mongoose.Schema<FieldConfig>({
  field_key: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  enabled: { type: Boolean, required: true },
  placeholder: String,
  default_value: mongoose.Schema.Types.Mixed,
  is_required: Boolean,
  min_length: Number,
  max_length: Number,
  min_value: Number,
  max_value: Number,
  pattern: String,
  options: [String],
  error_message: String,
}, { _id: false });

const formSchema = new mongoose.Schema({
  form_id: { type: String, required: true, unique: true, index: true },
  form_token: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: String,
  enabled_fields: { type: [fieldConfigSchema], required: true },
  dynamic_fields: { type: [fieldConfigSchema], default: [] },
  is_submitted: { type: Boolean, default: false },
  submitted_at: Date,
  link_expiry: Date,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

formSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

export const Form = mongoose.model('Form', formSchema);
