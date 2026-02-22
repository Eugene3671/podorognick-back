import express from 'express';
import {
  register,
  login,
  logout,
  refreshUserSession,
} from '../controllers/authController.js';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', celebrate(registerUserSchema), register);
router.post('/login', celebrate(loginUserSchema), login);
router.post('/logout', logout);
router.post('/refresh', refreshUserSession);

export default router;
