import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    articlesAmount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model('users', userSchema);
