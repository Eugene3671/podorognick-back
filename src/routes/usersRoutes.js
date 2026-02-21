// src/routes/usersRoutes.js

import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getUsers,
  getUserById,
  updateUserDetails,
  updateUserAvatar,
  getCurrentUser,
} from '../controllers/usersController.js';

import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';
import {
  userIdParamSchema,
  getUsersSchema,
} from '../validations/usersValidation.js';

const router = Router();

// Отримати всіх користувачів
router.get('/', celebrate(getUsersSchema), getUsers);

// Отримати профіль поточного користувача
router.get('/profile', authenticate, getCurrentUser);

// Отримати користувача по ID з валідацією
router.get('/:userId', celebrate(userIdParamSchema), getUserById);

// Оновити аватар
router.patch(
  '/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

// Оновити дані користувача
router.patch('/me', authenticate, updateUserDetails);

export default router;
