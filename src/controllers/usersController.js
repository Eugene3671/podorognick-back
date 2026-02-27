// src/controllers/usersController.js

import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { Traveller } from '../models/traveller.js';

// Отримати список усіх юзерів
export const getUsers = async (req, res) => {
  // Отримуємо параметри пагінації та сортування
  // по замовчуванню сортуємо за articlesAmount по спаданню
  const {
    page = 1,
    perPage = 10,
    search,
    sortBy = '_id',
    sortOrder = 'desc',
  } = req.query;
  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції
  const usersQuery = User.find();

  // Текстовий пошук по name (працює лише якщо створено текстовий індекс)
  if (search) {
    usersQuery.where({ $text: { $search: search } });
  }

  // Виконуємо одразу два запити паралельно
  const [totalItems, users] = await Promise.all([
    usersQuery.clone().countDocuments(),
    usersQuery
      .skip(skip)
      .limit(perPage)
      // Додамєдо сортування в ланцюжок методів квері
      .sort({ [sortBy]: sortOrder }),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    users,
  });
};

// Отримати одного юзера за id + його статті
export const getUserById = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, perPage = 10 } = req.query;
  const skip = (page - 1) * perPage;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const storiesQuery = await Traveller.find({ ownerId: userId });
  const [totalItems, stories] = await Promise.all([
    storiesQuery.clone().countDocuments(),
    storiesQuery.skip(skip).limit(perPage),
  ]);
  const totalPages = Math.ceil(totalItems / perPage);
  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    user,
    stories,
  });
};

// Отримати профіль поточного юзера
export const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.json({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    description: user.description,
    articlesAmount: user.articlesAmount,
  });
};

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      next(createHttpError(400, 'No file'));
      return;
    }

    const result = await saveFileToCloudinary(
      req.file.buffer,
      'avatars',
      req.user._id,
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: result.secure_url },
      { new: true },
    );

    res.status(200).json({
      message: 'Avatar updated successfully',
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserDetails = async (req, res, next) => {
  const user = await User.findOneAndUpdate(req.user._id, req.body, {
    new: true,
  });

  if (!user) {
    next(createHttpError(404, 'User not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Profile updated successfully',
    data: user,
  });
};
