import mongoose, { Schema, Document } from "mongoose";

export interface PressLogoDocument extends Document {
  name: string;
  logoUrl: string;
  link: string;
  position: number;
  createdAt: Date;
}

const pressLogoSchema = new Schema<PressLogoDocument>(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    link: { type: String, required: true },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const PressLogoModel = mongoose.model<PressLogoDocument>("PressLogo", pressLogoSchema);
