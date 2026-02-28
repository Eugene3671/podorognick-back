import express from 'express';
import {
  register,
  login,
  logout,
  refreshUserSession,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', celebrate(registerUserSchema), register);
router.post('/login', celebrate(loginUserSchema), login);
router.post('/logout', logout);
router.post('/refresh', refreshUserSession);
router.post(
  '/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail,
);
router.post('/reset-password', celebrate(resetPasswordSchema), resetPassword);

export default router;
