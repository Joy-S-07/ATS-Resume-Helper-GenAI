const mongoose = require("mongoose");

/**
 * Resume Schema
 * Stores user resumes with structured data, generated LaTeX code, and PDF URL
 */
const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    
    // Source of resume data
    source: {
      type: String,
      enum: ["upload", "manual", "latex"],
      required: true,
    },

    // Template style
    templateStyle: {
      type: String,
      enum: ["modern", "classic", "minimal"],
      default: "modern",
    },

    // Target role for ATS optimisation (e.g. "Senior Frontend Engineer at Stripe")
    targetRole: {
      type: String,
      default: "",
    },

    // Structured resume data
    resumeData: {
      profilePhoto: String,
      personalInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        address: String,
        title: String,
        dob: String,
        hobbies: String,
      },
      summary: String,
      softSkills: [{ name: String }],
      languages: [{ name: String }],
      experience: [
        {
          company: String,
          position: String,
          duration: String,
          description: String,
        },
      ],
      education: [
        {
          institution: String,
          degree: String,
          year: String,
        },
      ],
      references: [
        {
          name: String,
          contact: String,
        },
      ],
    },

    // Generated LaTeX code
    latexCode: {
      type: String,
      required: true,
    },

    // PDF URL (if compiled)
    pdfUrl: String,

    // Original uploaded file text (if source is upload)
    extractedText: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
resumeSchema.index({ userId: 1, createdAt: -1 });

const resumeModel = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

module.exports = resumeModel;
