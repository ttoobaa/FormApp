import { Router } from 'express';
import { validateRequest } from '../middleware/validation.js';
import { submitFormSchema } from '../validators/submission.js';
import { publicFormLimiter, submissionLimiter } from '../middleware/rateLimiter.js';
import * as formController from '../controllers/formController.js';

const router = Router();

router.get('/:token', publicFormLimiter, formController.getPublicForm);
router.post('/:token/submit', submissionLimiter, validateRequest(submitFormSchema), formController.submitForm);

export default router;
