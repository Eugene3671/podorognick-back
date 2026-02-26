import { Router } from 'express';
import authRouter from './authRoutes.js';
import usersRourer from './usersRoutes.js';
import storiesRouter from './storiesRoutes.js';
import categoriesRouter from './categoriesRoutes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRourer);
router.use('/stories', storiesRouter);
router.use('/categories', categoriesRouter);

export default router;
