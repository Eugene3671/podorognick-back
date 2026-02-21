import { Schema, model } from 'mongoose';

const storySchema = new Schema(
   {
    img: { type: String, required: true },
    title: { type: String, required: true,  trim: true },
    description: { type: String, required: true,  trim: true},
    category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    favCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Story = model('Article', storySchema);
