import mongoose, { Schema, Document } from "mongoose";

export interface TestimonialDocument extends Document {
  authorName: string;
  content: string;
  rating: number;
  featuredProductIds: string[];
  isFeatured: boolean;
  createdAt: Date;
}

const testimonialSchema = new Schema<TestimonialDocument>(
  {
    authorName: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    featuredProductIds: { type: [String], default: [] },
    isFeatured: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const TestimonialModel = mongoose.model<TestimonialDocument>("Testimonial", testimonialSchema);
