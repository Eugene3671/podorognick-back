import mongoose from 'mongoose';

export const skipReservedStoryId = (req, res, next) => {
  const { storyId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    return next('route');
  }

  next();
};
