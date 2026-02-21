// src/controllers/usersController.js

import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

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

  if (!req.file) {
    next(createHttpError(400, 'No file'));
    return;
  }

  const result = await saveFileToCloudinary(
    req.file.buffer,
    'avatar',
    req.user._id,
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl: result.secure_url },
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
