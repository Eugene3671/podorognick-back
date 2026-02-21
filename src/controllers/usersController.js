// src/controllers/studentsController.js

import createHttpError from 'http-errors';

import { User } from '../models/user.js';

// Отримати список усіх юзерів
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
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
