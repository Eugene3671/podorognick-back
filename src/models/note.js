import { model, Schema } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);
notesSchema.index(
  {
    title: 'text',
    content: 'text',
  },
  {
    name: 'NotesTextIndex',
    weights: {
      title: 10,
      content: 2,
    },
    default_language: 'english',
  },
);

export const Note = model('Note', notesSchema);
