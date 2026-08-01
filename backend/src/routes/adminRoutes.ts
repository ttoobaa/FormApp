import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { createFormSchema } from '../validators/form';
import * as adminController from '../controllers/adminController';

const router = Router();

router.post('/forms', validateRequest(createFormSchema), adminController.createForm);
router.get('/forms', adminController.getAllForms);
router.get('/forms/:formId', adminController.getFormById);
router.delete('/forms/:formId', adminController.deleteForm);
router.get('/forms/:formId/submission', adminController.getSubmission);

export default router;
