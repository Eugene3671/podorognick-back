import { Router } from 'express';
import { celebrate } from 'celebrate';
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
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', celebrate(getAllStoriesShema), getAllStories);
router.use('/', authenticate);
router.get('/saved', celebrate(getALLSaveStoryShema), getALLSaveStory);
router.post(
  '/:storyId/save',
  celebrate(addToSavedStoriesSchema),
  addToSavedStories,
);
router.delete(
  '/:storyId/save',
  celebrate(deleteSaveStorySchema),
  deleteSaveStory,
);

export default router;
