import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllStories,
  addToSavedStories,
  deleteSaveStory,
  getALLSaveStory,
} from '../controllers/storiesController.js';
import {
  getAllStoriesShema,
  addToSavedStoriesSchema,
  deleteSaveStorySchema,
  getALLSaveStoryShema,
} from '../validations/storiesValidation.js';

const router = Router();

router.get('/stories', celebrate(getAllStoriesShema), getAllStories);
router.use('/stories', authMiddleware);
router.get('/stories/saved', celebrate(getALLSaveStoryShema), getALLSaveStory);
router.post(
  '/stories/:storyId/save',
  celebrate(addToSavedStoriesSchema),
  addToSavedStories,
);
router.delete(
  '/stories/:storyId/save',
  celebrate(deleteSaveStorySchema),
  deleteSaveStory,
);

export default router;
