// src/routes/usersRoutes.js
import {
  getUsers,
  getUserById,
  updateUserDetails,
  updateUserAvatar,
} from '../controllers/usersController.js';

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.get('/', getUsers);
router.get('/profile', authMiddleware, getCurrentUser);
router.get('/:userId', getUserById);
router.patch(
  '/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);
router.patch('/me', authenticate, updateUserDetails);
export default router;
