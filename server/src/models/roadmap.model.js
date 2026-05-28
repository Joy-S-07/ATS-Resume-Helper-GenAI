const mongoose = require("mongoose");

// ─── Subtask Schema ───────────────────────────────────────────────────────────
const subtaskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "need-help", "failed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    tools: { type: [String], default: [] },
  },
  { _id: false }
);

// ─── Task Schema ──────────────────────────────────────────────────────────────
const taskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "need-help", "failed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    level: { type: Number, default: 0 },
    dependencies: { type: [String], default: [] },
    subtasks: { type: [subtaskSchema], default: [] },
  },
  { _id: false }
);

// ─── Roadmap Schema ───────────────────────────────────────────────────────────
const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    tasks: {
      type: [taskSchema],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const roadmapModel = mongoose.model("Roadmap", roadmapSchema);
module.exports = roadmapModel;
