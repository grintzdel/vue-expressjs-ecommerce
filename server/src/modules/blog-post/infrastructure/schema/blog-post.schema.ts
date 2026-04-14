import mongoose, { Schema, Document } from "mongoose";

export interface BlogPostDocument extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  publishedAt: Date | null;
  tags: string[];
  createdAt: Date;
}

const blogPostSchema = new Schema<BlogPostDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true, default: "" },
    featuredImage: { type: String, required: true, default: "" },
    author: { type: String, required: true },
    publishedAt: { type: Date, default: null },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const BlogPostModel = mongoose.model<BlogPostDocument>("BlogPost", blogPostSchema);
