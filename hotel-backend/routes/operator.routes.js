import { Router } from 'express';
import * as reservationsController from '../controllers/reservations.controller.js';
import * as statsController from '../controllers/stats.controller.js';

const router = Router();

router.get('/stats', statsController.operatorStats);
router.get('/reservations', reservationsController.list);
router.put('/reservations/:id', reservationsController.updateStatus);
router.delete('/reservations/:id', reservationsController.cancel);

export default router;
