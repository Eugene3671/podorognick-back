import createHttpError from 'http-errors';
import { Traveller } from '../models/traveller.js';
import { User } from '../models/user.js';
import mongoose from 'mongoose';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';



export const getAllStories = async (req, res) => {
  const { category, page = 1, perPage = 10 } = req.query;

  const skip = (page - 1) * perPage;

  const storiesQuery = Traveller.find();

  if (category) {
    storiesQuery.where({ category });
  }

  const [totalStories, stories] = await Promise.all([
    storiesQuery.clone().countDocuments(),
    storiesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalStories / perPage);

  res.status(200).json({
    page,
    perPage,
    totalStories,
    totalPages,
    stories,
  });
};

export const addToSavedStories = async (req, res, next) => {
  const { storyId } = req.params;
  const { id: userId } = req.user;

  const storyObjectId = new mongoose.Types.ObjectId(storyId);

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const story = await Traveller.findById(storyObjectId);

  if (!story) {
    next(createHttpError(404, 'Story not found'));
    return;
  }

  const result = await User.findOneAndUpdate(
    {
      _id: req.user.id,
      savedStories: { $ne: storyObjectId },
    },
    {
      $push: { savedStories: storyObjectId },
    },
    { new: true, timestamps: false },
  );
  if (!result) {
    return res.status(200).json({ message: 'Story already saved' });
  }

  await Traveller.updateOne({ _id: storyId }, { $inc: { favoriteCount: 1 } });

  res.status(200).json({ message: 'Story saved' });
};

export const deleteSaveStory = async (req, res, next) => {
  const { storyId } = req.params;
  const { id: userId } = req.user;
  const storyObjectId = new mongoose.Types.ObjectId(storyId);

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const story = await Traveller.findById(storyObjectId);

  if (!story) {
    next(createHttpError(404, 'Story not found'));
    return;
  }

  const result = await User.findOneAndUpdate(
    {
      _id: req.user.id,
      savedStories: storyObjectId,
    },
    {
      $pull: { savedStories: storyObjectId },
    },
    { new: true, timestamps: false },
  );

  if (!result) {
    return res.status(200).json({ message: 'Story not saved' });
  }

  await Traveller.updateOne({ _id: storyId }, { $inc: { favoriteCount: -1 } });

  res.status(200).json({ message: 'Story delete' });
};

export const getALLSaveStory = async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;

  const skip = (page - 1) * perPage;

  const storiesQuery = await User.findById(req.user.id)
    .populate({
      path: 'savedStories',
      options: {
        skip: skip,
        limit: perPage,
      },
    })
    .select('savedStories');

  const fullUser = await User.findById(req.user.id).select('savedStories');
  const totalStories = fullUser.savedStories.length;

  const totalPages = Math.ceil(totalStories / perPage);

  res.status(200).json({
    page,
    perPage,
    totalPages,
    totalStories,
    stories: storiesQuery.savedStories,
  });
};



export const createStory = async (req, res) => {
  try {
     if (!req.file) {
      throw createHttpError(400, "storyImage is required");
     }

     const folderName = "stories";
    const userId = req.user._id.toString();


    const result = await saveFileToCloudinary(req.file.buffer,
      folderName,
      userId);


        const { title, article, category, date } = req.body;

    const story = await Traveller.create({
      title,
      article,
      category,
      date,
      ownerId: req.user._id,
      img: result.secure_url,
    });

    res.status(201).json(story);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message });
  }
};
