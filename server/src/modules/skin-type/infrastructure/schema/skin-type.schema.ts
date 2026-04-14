import mongoose, { Schema, Document } from "mongoose";

export interface SkinTypeDocument extends Document {
  name: string;
  slug: string;
  createdAt: Date;
}

const skinTypeSchema = new Schema<SkinTypeDocument>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const SkinTypeModel = mongoose.model<SkinTypeDocument>("SkinType", skinTypeSchema);
