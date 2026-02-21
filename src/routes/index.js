import { Router } from 'express';
import authRouter from './authRoutes.js';
import usersRourer from './usersRoutes.js';
import storiesRouter from './storiesRoutes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRourer);
router.use('/stories', storiesRouter);

export default router;
