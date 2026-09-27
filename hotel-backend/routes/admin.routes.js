import { Router } from 'express';
import * as logsController from '../controllers/logs.controller.js';
import * as operatorsController from '../controllers/operators.controller.js';
import * as reservationsController from '../controllers/reservations.controller.js';
import * as statsController from '../controllers/stats.controller.js';

const router = Router();

// Dashboard data
router.get('/stats', statsController.adminStats);
router.get('/charts', statsController.adminCharts);

// Reservations (read-only view for the admin panel)
router.get('/reservations', reservationsController.list);

// Operators / admins
router.get('/operators', operatorsController.list);
router.post('/operators', operatorsController.create);
router.put('/operators/:id', operatorsController.update);
router.delete('/operators/:id', operatorsController.remove);

// System logs
router.get('/logs', logsController.list);

export default router;
