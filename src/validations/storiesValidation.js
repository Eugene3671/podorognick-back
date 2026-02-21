import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const getAllStoriesShema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(3).max(20).default(9),
    category: Joi.string().custom(objectIdValidator),
  }),
};

export const addToSavedStoriesSchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const deleteSaveStorySchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const getALLSaveStoryShema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(3).max(20).default(6),
  }),
};



export const createStorySchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().max(80).required().messages({
      "string.empty": "Title is required",
      "string.max": "Title must be at most 80 characters",
    }),
    description: Joi.string().max(2500).required().messages({
      "string.empty": "Description is required",
      "string.max": "Description must be at most 2500 characters",
    }),
    category: Joi.string().required().messages({
       "any.required": "Category is required",
    "string.empty": "Category is required",
    }),
  }),
};
