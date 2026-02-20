// src/routes/usersRoutes.js
import { getUsers, getUserById } from '../controllers/usersController.js';

import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);

export default router;
