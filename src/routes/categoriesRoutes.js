import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getCategories } from '../controllers/categoriesController.js';
import { getCategoriesSchema } from '../validations/categoriesValidation.js';

const router = Router();

router.get('/', celebrate(getCategoriesSchema), getCategories);

export default router;
