const mongoose = require("mongoose");

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const keywordSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true },
    found: { type: Boolean, default: false },
  },
  { _id: false }
);

const formattingIssueSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["error", "warning", "pass"], required: true },
    message: { type: String, required: true },
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },   // e.g. "Contact Info"
    present: { type: Boolean, default: false },
  },
  { _id: false }
);

// ─── Main ATS Result Schema ───────────────────────────────────────────────────
const atsResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: { type: String, required: true },
    jobRole: { type: String, required: true, trim: true },

    // Overall score 0-100
    score: { type: Number, required: true, min: 0, max: 100 },

    // Short headline verdict e.g. "Great Match!" / "Needs Work"
    verdict: { type: String, required: true },

    // One-paragraph summary shown under the score
    summary: { type: String, required: true },

    // Quantifiable metrics found in the resume
    metrics: {
      count: { type: Number, default: 0 },
      examples: { type: [String], default: [] },
    },

    // Action verbs
    actionVerbs: {
      strong: { type: [String], default: [] },
      weak: { type: [String], default: [] },
    },

    // Keyword match against the job role
    keywords: {
      matched: { type: [keywordSchema], default: [] },
      missing: { type: [keywordSchema], default: [] },
    },

    // Formatting issues
    formattingIssues: { type: [formattingIssueSchema], default: [] },

    // Core section presence
    sections: { type: [sectionSchema], default: [] },

    // Prioritised list of improvement recommendations
    recommendations: { type: [String], default: [] },
  },
  { timestamps: true }
);

const atsResultModel = mongoose.model("ATSResult", atsResultSchema);
module.exports = atsResultModel;
