// src/controllers/categoriesController.js

import { Category } from '../models/category.js';

// Отримати всі категорії (публічний ендпоїнт)
export const getCategories = async (req, res) => {
  // Отримуємо всі категорії без додаткової логіки
  const categories = await Category.find();

  // Повертаємо масив категорій
  res.status(200).json(categories);
};
