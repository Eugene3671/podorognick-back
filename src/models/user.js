import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: false,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
    description: {
      type: String,
      default: '',
    },
    articlesAmount: {
      type: Number,
      default: 0,
    },
    savedStories: {
      type: [Schema.Types.ObjectId],
      ref: 'Traveller',
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index(
  { name: 'text' },
  {
    name: 'UserTextIndex',
    weights: { name: 10 },
    default_language: 'english',
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.index({ email: 1 }, { unique: true, sparse: true });

export const User = model('User', userSchema);
