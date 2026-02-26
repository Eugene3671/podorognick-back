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
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(4).max(20),
    search: Joi.string().trim().allow(''),
    sortBy: Joi.string().valid('_id', 'name', 'articlesAmount', 'avgMark'),
    sortOrder: Joi.string().valid('asc', 'desc'),
  }),
};
