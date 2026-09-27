import { Router } from 'express';
import * as logsController from '../controllers/logs.controller.js';

const router = Router();

router.post('/', logsController.create);

export default router;
