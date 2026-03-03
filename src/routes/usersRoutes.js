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

router.get('/', celebrate(getUsersSchema), getUsers);
router.get('/profile', authenticate, getCurrentUser);
router.get('/:userId', celebrate(userIdParamSchema), getUserById);
router.patch(
  '/me/avatar',
  authenticate,
  upload.single('avatarUrl'),
  updateUserAvatar,
);
router.patch('/me', authenticate, updateUserDetails);

export default router;
