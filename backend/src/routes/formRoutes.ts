import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { submitFormSchema } from '../validators/submission';
import { publicFormLimiter, submissionLimiter } from '../middleware/rateLimiter';
import * as formController from '../controllers/formController';

const router = Router();

router.get('/:token', publicFormLimiter, formController.getPublicForm);
router.post('/:token/submit', submissionLimiter, validateRequest(submitFormSchema), formController.submitForm);

export default router;
