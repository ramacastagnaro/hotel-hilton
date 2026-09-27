import { Router } from 'express';
import * as paymentsController from '../controllers/payments.controller.js';

const router = Router();

router.post('/preference', paymentsController.createPreference);
router.post('/webhook', paymentsController.webhook);
router.get('/status', paymentsController.status);

export default router;
