import { Router } from 'express';
import { celebrate } from 'celebrate';
import { upload } from '../middleware/multer.js';

import {
  getAllStories,
  addToSavedStories,
  deleteSaveStory,
  getALLSaveStory,
  createStory,
  getMyStories,
  updateStory,
  getStoryById,
} from '../controllers/storiesController.js';
import {
  getAllStoriesShema,
  addToSavedStoriesSchema,
  deleteSaveStorySchema,
  getALLSaveStoryShema,
  createStorySchema,
  getMyStoriesSchema,
  updateStorySchema,
  getStoryByIdSchema,
} from '../validations/storiesValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { skipReservedStoryId } from '../middleware/skipReservedStoryId.js';

const router = Router();

router.get('/', celebrate(getAllStoriesShema), getAllStories);
router.get(
  '/:storyId',
  skipReservedStoryId,
  celebrate(getStoryByIdSchema),
  getStoryById,
);

router.use('/', authenticate);

router.get('/my', celebrate(getMyStoriesSchema), getMyStories);
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

router.post(
  '/',
  upload.single('img'),
  celebrate(createStorySchema),
  createStory,
);

router.patch('/:storyId', celebrate(updateStorySchema), updateStory);

export default router;
