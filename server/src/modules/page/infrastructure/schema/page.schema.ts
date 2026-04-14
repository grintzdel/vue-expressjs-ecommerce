import mongoose, { Schema, Document } from "mongoose";

export interface PageDocument extends Document {
  title: string;
  slug: string;
  content: string;
  seoMeta: { title: string; description: string };
  isPublished: boolean;
  createdAt: Date;
}

const pageSchema = new Schema<PageDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true, default: "" },
    seoMeta: {
      title: { type: String, required: true, default: "" },
      description: { type: String, required: true, default: "" },
    },
    isPublished: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const PageModel = mongoose.model<PageDocument>("Page", pageSchema);
