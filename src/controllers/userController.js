import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No File');
  }
  const result = await saveFileToCloudinary(req.file.buffer, req.user._id);
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true },
  );
  res.status(200).json({ url: updatedUser.avatar });
};
