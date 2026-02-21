import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', celebrate(registerUserSchema), register);
router.post('/login', celebrate(loginUserSchema), login);
router.post('/logout', logout);

export default router;
