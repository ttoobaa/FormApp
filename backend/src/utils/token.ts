import crypto from 'crypto';

export function generateFormToken(): string {
  return crypto.randomBytes(24).toString('base64url');
}

export function generateFormId(): string {
  return crypto.randomUUID();
}

export function generateSubmissionId(): string {
  return crypto.randomUUID();
}
