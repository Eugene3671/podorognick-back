// src/validations/usersValidation.js

import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// Схема для перевірки параметра userId
export const userIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const getUsersSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),

    // поле, за яким будемо сортувати (наприклад: articlesAmount)
    sortBy: Joi.string().valid('articlesAmount').default('articlesAmount'),

    // напрямок сортування: asc або desc
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};
