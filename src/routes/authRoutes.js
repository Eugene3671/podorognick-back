import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
const router = express.Router();

router.post('/register', register); // публічний
router.post('/login', login); // публічний
router.post('/logout', authenticate, logout); // приватний

export default router;
