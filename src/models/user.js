import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      // required: true,
    },
    articlesAmount: {
      type: Number,
      default: 0,
    },
    savedStories: {
      type: [Schema.Types.ObjectId],
      ref: 'travellers',
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Хешування пароля перед збереженням (з коду колеги)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
