import mongoose, { Schema, Document } from "mongoose";

export interface TagDocument extends Document {
  name: string;
  slug: string;
  createdAt: Date;
}

const tagSchema = new Schema<TagDocument>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const TagModel = mongoose.model<TagDocument>("Tag", tagSchema);
