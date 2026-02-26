// src/validations/categoriesValidation.js

import { Joi, Segments } from 'celebrate';

export const getCategoriesSchema = {
  [Segments.QUERY]: Joi.object({}).unknown(false),
};
