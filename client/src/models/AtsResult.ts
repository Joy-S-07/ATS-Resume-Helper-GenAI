import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Shared interface (used by both API route and frontend) ───────────────────
export interface AtsResult {
  jobRole: string;
  fileName: string;
  atsScore: number;
  verdict: string;
  summary: string;
  missingKeywords: string[];
  matchedKeywords: string[];
  recommendations: string[];
  metrics: { count: number; examples: string[] };
  actionVerbs: { strong: string[]; weak: string[] };
  formattingIssues: { type: "error" | "warning" | "pass"; message: string }[];
  sections: { name: string; present: boolean }[];
  createdAt?: Date;
}

export interface AtsResultDocument extends AtsResult, Document {}

const AtsResultSchema = new Schema<AtsResultDocument>(
  {
    jobRole: { type: String, required: true, trim: true },
    fileName: { type: String, required: true },
    atsScore: { type: Number, required: true, min: 0, max: 100 },
    verdict: { type: String, required: true },
    summary: { type: String, required: true },
    missingKeywords: { type: [String], default: [] },
    matchedKeywords: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    metrics: {
      count: { type: Number, default: 0 },
      examples: { type: [String], default: [] },
    },
    actionVerbs: {
      strong: { type: [String], default: [] },
      weak: { type: [String], default: [] },
    },
    formattingIssues: [
      {
        type: { type: String, enum: ["error", "warning", "pass"] },
        message: String,
        _id: false,
      },
    ],
    sections: [
      {
        name: String,
        present: Boolean,
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

// Safe model registration for Next.js hot-reload
const AtsResultModel: Model<AtsResultDocument> =
  (mongoose.models.AtsResult as Model<AtsResultDocument>) ||
  mongoose.model<AtsResultDocument>("AtsResult", AtsResultSchema);

export default AtsResultModel;
