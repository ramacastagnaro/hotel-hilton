import { Router } from 'express';
import * as reservationsController from '../controllers/reservations.controller.js';

const router = Router();

router.get('/', reservationsController.list);
router.get('/user/:uid', reservationsController.listByUser);
router.post('/', reservationsController.create);
router.put('/:id', reservationsController.updateStatus);
router.patch('/:id', reservationsController.updatePayment);
router.delete('/:id', reservationsController.cancel);

export default router;
