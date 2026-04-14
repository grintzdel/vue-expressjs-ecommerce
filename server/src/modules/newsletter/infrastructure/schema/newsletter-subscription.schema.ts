import mongoose, { Schema, Document } from "mongoose";

export interface NewsletterSubscriptionDocument extends Document {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  discountCode: string | null;
  createdAt: Date;
}

const newsletterSubscriptionSchema = new Schema<NewsletterSubscriptionDocument>(
  {
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, required: true },
    isActive: { type: Boolean, required: true, default: true },
    discountCode: { type: String, default: null },
  },
  { timestamps: true }
);

export const NewsletterSubscriptionModel = mongoose.model<NewsletterSubscriptionDocument>(
  "NewsletterSubscription",
  newsletterSubscriptionSchema
);
