import mongoose, { Schema, Document } from "mongoose";

export interface SkinDiagnosisDocument extends Document {
  sessionToken: string;
  answers: { questionId: string; answer: string }[];
  result: string | null;
  recommendedProductIds: string[];
  createdAt: Date;
}

const skinDiagnosisSchema = new Schema<SkinDiagnosisDocument>(
  {
    sessionToken: { type: String, required: true, unique: true },
    answers: [
      {
        questionId: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    result: { type: String, default: null },
    recommendedProductIds: [{ type: String }],
  },
  { timestamps: true }
);

export const SkinDiagnosisModel = mongoose.model<SkinDiagnosisDocument>("SkinDiagnosis", skinDiagnosisSchema);
