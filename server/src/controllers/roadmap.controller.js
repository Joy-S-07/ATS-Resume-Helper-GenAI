const roadmapModel = require("../models/roadmap.model");

// ─── OpenRouter config ────────────────────────────────────────────────────────
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Ordered fallback list — tries each until one returns a non-empty response
const MODELS = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "deepseek/deepseek-v4-flash:free",
  "openai/gpt-oss-20b:free",
];

// ─── Logger helper ────────────────────────────────────────────────────────────
function log(level, context, message, extra = {}) {
  const ts = new Date().toISOString();
  const extraStr = Object.keys(extra).length
    ? " | " + Object.entries(extra).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(" ")
    : "";
  const icons = { INFO: "ℹ️ ", OK: "✅", WARN: "⚠️ ", ERROR: "❌" };
  console.log(`${icons[level] || "  "} [${ts}] [ROADMAP:${context}] ${message}${extraStr}`);
}

/**
 * Calls OpenRouter with a fallback model chain.
 * Tries each model in MODELS until one returns a valid JSON array.
 */
async function generateRoadmapFromAI(role) {
  const systemPrompt = `You are a career roadmap expert. When given a job role, you generate a structured, actionable learning roadmap as a JSON array of tasks.

Each task MUST follow this exact TypeScript interface:
{
  id: string,           // sequential "1", "2", "3" ...
  title: string,        // concise task title
  description: string,  // 1-2 sentence explanation
  status: "pending",    // always "pending" for new roadmaps
  priority: "high" | "medium" | "low",
  level: number,        // 0 = beginner, 1 = intermediate, 2 = advanced
  dependencies: string[], // ids of tasks that must be done first (empty for first tasks)
  subtasks: [
    {
      id: string,         // "1.1", "1.2" etc.
      title: string,
      description: string,
      status: "pending",
      priority: "high" | "medium" | "low",
      tools?: string[]    // optional: relevant tools/technologies
    }
  ]
}

Rules:
- Return ONLY a valid JSON array, no markdown, no explanation, no code fences.
- Generate 5-7 main tasks with 2-4 subtasks each.
- Make the roadmap realistic and specific to the role.
- Order tasks from foundational to advanced.
- Set dependencies logically (later tasks depend on earlier ones).`;

  const userPrompt = `Generate a comprehensive career roadmap for: ${role}`;

  let lastError = null;

  for (const model of MODELS) {
    log("INFO", "AI", `Trying model: ${model}`, { role });

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
          "X-Title": "ATS Resume Helper - Roadmap Builder",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      log("INFO", "AI", `OpenRouter responded`, { model, status: response.status });

      // 402 = out of credits, 404 = model unavailable, 429 = rate limited — try next
      if (response.status === 402 || response.status === 404 || response.status === 429) {
        const errText = await response.text();
        log("WARN", "AI", `Model unavailable or out of credits, trying next`, { model, status: response.status });
        lastError = new Error(`OpenRouter API error ${response.status}: ${errText}`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
      }

      const data = await response.json();

      log("INFO", "AI", "Raw response structure", {
        model,
        hasChoices: !!data.choices,
        choicesLen: data.choices?.length ?? 0,
        finishReason: data.choices?.[0]?.finish_reason,
      });

      const rawContent = data.choices?.[0]?.message?.content;

      if (!rawContent || rawContent.trim() === "") {
        log("WARN", "AI", `Empty content from model, trying next`, { model });
        lastError = new Error(`Empty response from model ${model}`);
        continue;
      }

      // Strip accidental markdown fences
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      let tasks;
      try {
        tasks = JSON.parse(cleaned);
      } catch (parseErr) {
        log("WARN", "AI", `JSON parse failed, trying next model`, { model, preview: cleaned.slice(0, 200) });
        lastError = new Error(`JSON parse error from model ${model}`);
        continue;
      }

      if (!Array.isArray(tasks)) {
        log("WARN", "AI", `Response is not an array, trying next model`, { model });
        lastError = new Error(`Non-array response from model ${model}`);
        continue;
      }

      log("OK", "AI", `Roadmap generated`, { model, taskCount: tasks.length });
      return tasks;

    } catch (err) {
      if (err.message.includes("402") || err.message.includes("404") || err.message.includes("429")) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error("All models returned empty responses. Please try again.");
}

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * @route  POST /api/roadmap/generate
 * @desc   Generate a new roadmap via AI and save it for the logged-in user
 * @access Private
 */
async function generateRoadmapController(req, res) {
  const { role } = req.body;

  log("INFO", "REQUEST", "POST /api/roadmap/generate received", { user: req.user?.id, role });

  if (!role || !role.trim()) {
    log("WARN", "REQUEST", "Missing role in request body");
    return res.status(400).json({ message: "Role is required" });
  }

  try {
    log("INFO", "AI", "Calling OpenRouter for roadmap", { role: role.trim() });
    const tasks = await generateRoadmapFromAI(role.trim());
    log("OK", "AI", "Roadmap tasks generated", { taskCount: tasks.length });

    log("INFO", "DB", "Saving roadmap to database", { userId: req.user.id });
    const roadmap = await roadmapModel.create({
      userId: req.user.id,
      role: role.trim(),
      tasks,
    });
    log("OK", "DB", "Roadmap saved", { id: roadmap._id, role: roadmap.role });

    return res.status(201).json({
      message: "Roadmap generated and saved successfully",
      roadmap: {
        _id: roadmap._id,
        role: roadmap.role,
        tasks: roadmap.tasks,
        createdAt: roadmap.createdAt,
        updatedAt: roadmap.updatedAt,
      },
    });
  } catch (error) {
    log("ERROR", "CONTROLLER", error.message);

    if (error.message.startsWith("OpenRouter")) {
      return res.status(502).json({ message: "AI service error. Please try again." });
    }
    if (error.message.includes("JSON")) {
      return res.status(502).json({ message: "AI returned an unexpected format. Please try again." });
    }

    return res.status(500).json({ message: "Failed to generate roadmap" });
  }
}

/**
 * @route  GET /api/roadmap
 * @desc   Get all roadmaps for the logged-in user (newest first)
 * @access Private
 */
async function getUserRoadmapsController(req, res) {
  try {
    const roadmaps = await roadmapModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("_id role createdAt updatedAt tasks");

    return res.status(200).json({
      message: "Roadmaps fetched successfully",
      roadmaps,
    });
  } catch (error) {
    console.error("Fetch roadmaps error:", error.message);
    return res.status(500).json({ message: "Failed to fetch roadmaps" });
  }
}

/**
 * @route  GET /api/roadmap/:id
 * @desc   Get a single roadmap by ID (must belong to the logged-in user)
 * @access Private
 */
async function getRoadmapByIdController(req, res) {
  try {
    const roadmap = await roadmapModel.findOne({
      _id: req.params.id,
      userId: req.user.id, // ownership check
    });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    return res.status(200).json({
      message: "Roadmap fetched successfully",
      roadmap,
    });
  } catch (error) {
    console.error("Get roadmap error:", error.message);
    return res.status(500).json({ message: "Failed to fetch roadmap" });
  }
}

/**
 * @route  PATCH /api/roadmap/:id
 * @desc   Update task/subtask statuses for a roadmap (must belong to the logged-in user)
 * @access Private
 */
async function updateRoadmapController(req, res) {
  const { tasks } = req.body;

  if (!tasks || !Array.isArray(tasks)) {
    return res.status(400).json({ message: "tasks array is required" });
  }

  try {
    const roadmap = await roadmapModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { tasks } },
      { new: true, runValidators: true }
    );

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    return res.status(200).json({
      message: "Roadmap updated successfully",
      roadmap,
    });
  } catch (error) {
    console.error("Update roadmap error:", error.message);
    return res.status(500).json({ message: "Failed to update roadmap" });
  }
}

/**
 * @route  DELETE /api/roadmap/:id
 * @desc   Delete a roadmap (must belong to the logged-in user)
 * @access Private
 */
async function deleteRoadmapController(req, res) {
  try {
    const roadmap = await roadmapModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    return res.status(200).json({ message: "Roadmap deleted successfully" });
  } catch (error) {
    console.error("Delete roadmap error:", error.message);
    return res.status(500).json({ message: "Failed to delete roadmap" });
  }
}

module.exports = {
  generateRoadmapController,
  getUserRoadmapsController,
  getRoadmapByIdController,
  updateRoadmapController,
  deleteRoadmapController,
};
