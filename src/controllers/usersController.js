// src/controllers/studentsController.js

import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// Отримати список усіх юзерів
export const getUsers = async (req, res) => {
  // Отримуємо параметри пагінації та сортування
  // по замовчуванню сортуємо за articlesAmount по спаданню
  const {
    page = 1,
    perPage = 10,
    sortBy = 'articlesAmount',
    sortOrder = 'desc',
  } = req.query;
  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції
  const usersQuery = User.find();

  // Додаємо сортування до запиту
  usersQuery.sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

  // Виконуємо одразу два запити паралельно
  const [totalItems, users] = await Promise.all([
    usersQuery.clone().countDocuments(),
    usersQuery.skip(skip).limit(perPage),
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

// Отримати одного юзера за id
export const getUserById = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json(user);
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
  if (!req.file) {
    next(createHttpError(400, 'No file'));
    return;
  }

  const result = await saveFileToCloudinary(req.file.buffer);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true },
  );

  res.status(200).json({ url: user.avatar });
};

export const updateUserDetails = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
  });

  if (!user) {
    next(createHttpError(404, 'User not found'));
    return;
  }

  res.status(200).json(user);
};
