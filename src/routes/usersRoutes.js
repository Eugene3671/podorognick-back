// src/routes/usersRoutes.js
import {
  getUsers,
  getUserById,
  getCurrentUser,
} from '../controllers/usersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/profile', authMiddleware, getCurrentUser);
router.get('/:userId', getUserById);

export default router;
