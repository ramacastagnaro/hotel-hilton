import { Router } from 'express';
import * as roomsController from '../controllers/rooms.controller.js';

const router = Router();

router.get('/', roomsController.list);
router.get('/:id', roomsController.getOne);
router.post('/', roomsController.create);
router.put('/:id', roomsController.update);
// PATCH is used by the operator panel to flip a room's availability status.
router.patch('/:id', roomsController.update);
router.delete('/:id', roomsController.remove);

export default router;
