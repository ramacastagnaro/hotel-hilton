import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

// Exchange a Firebase ID token for the matching operator profile + role.
router.post('/operator-login', authController.operatorLogin);
router.get('/me', authController.me);

export default router;
