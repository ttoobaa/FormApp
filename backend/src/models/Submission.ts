import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  submission_id: { type: String, required: true, unique: true, index: true },
  form_id: { type: String, required: true, index: true },
  form_token: { type: String, required: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  submitted_at: { type: Date, default: Date.now },
});

export const Submission = mongoose.model('Submission', submissionSchema);
