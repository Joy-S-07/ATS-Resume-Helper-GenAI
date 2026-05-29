// ─── Logger helper ────────────────────────────────────────────────────────────
function log(level, context, message, extra = {}) {
  const ts = new Date().toISOString();
  const extraStr = Object.keys(extra).length
    ? " | " + Object.entries(extra).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(" ")
    : "";
  const icons = { INFO: "ℹ️ ", OK: "✅", WARN: "⚠️ ", ERROR: "❌" };
  console.log(`${icons[level] || "  "} [${ts}] [ATS:${context}] ${message}${extraStr}`);
}

const atsResultModel = require("../models/ats-result.model");
const { extractText } = require("../utils/extractText");

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Ordered fallback list — tries each until one returns a non-empty response
const MODELS = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "deepseek/deepseek-v4-flash:free",
  "openai/gpt-oss-20b:free",
];

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume analyst.
Given a resume's plain text and a target job role, you analyse the resume and return a structured JSON object.

You MUST return ONLY a valid JSON object — no markdown, no code fences, no explanation.

The JSON must match this exact shape:
{
  "score": number,                  // 0-100 overall ATS compatibility score
  "verdict": string,                // short headline: "Excellent Match" | "Great Match!" | "Good Start" | "Needs Work" | "Major Issues"
  "summary": string,                // 2-3 sentence paragraph shown under the score
  "metrics": {
    "count": number,                // how many quantifiable achievements were found
    "examples": string[]            // up to 5 example phrases from the resume
  },
  "actionVerbs": {
    "strong": string[],             // strong action verbs found (up to 8)
    "weak": string[]                // weak/passive phrases found (up to 5)
  },
  "keywords": {
    "matched": [{ "keyword": string, "found": true }],   // role-relevant keywords present
    "missing": [{ "keyword": string, "found": false }]   // important keywords absent
  },
  "formattingIssues": [
    { "type": "error" | "warning" | "pass", "message": string }
  ],
  "sections": [
    { "name": string, "present": boolean }   // check for: Contact Info, Summary, Experience, Education, Skills, Certifications, Projects
  ],
  "recommendations": string[]       // 4-6 prioritised, specific, actionable improvement tips
}

Scoring guide:
- 85-100: Excellent — strong keywords, metrics, formatting, all sections present
- 70-84:  Great — minor gaps
- 55-69:  Good — several improvements needed
- 40-54:  Needs Work — significant gaps
- 0-39:   Major Issues — fundamental problems`;

// ─── Call OpenRouter with fallback ───────────────────────────────────────────
async function analyseWithAI(resumeText, jobRole) {
  const userPrompt = `Target Job Role: ${jobRole}

Resume Text:
---
${resumeText.slice(0, 12000)}
---

Analyse this resume for ATS compatibility and return the JSON object.`;

  let lastError = null;

  for (const model of MODELS) {
    log("INFO", "AI", `Trying model: ${model}`, { role: jobRole, textLen: resumeText.length });

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
          "X-Title": "ATS Resume Helper - ATS Checker",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2048,
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

      // Log the full response structure for debugging
      log("INFO", "AI", "Raw response structure", {
        model,
        hasChoices: !!data.choices,
        choicesLen: data.choices?.length ?? 0,
        finishReason: data.choices?.[0]?.finish_reason,
      });

      const rawContent = data.choices?.[0]?.message?.content;

      // Empty content = model returned nothing — try next model
      if (!rawContent || rawContent.trim() === "") {
        log("WARN", "AI", `Empty content from model, trying next`, { model });
        lastError = new Error(`Empty response from model ${model}`);
        continue;
      }

      log("INFO", "AI", "Raw AI content received", { model, chars: rawContent.length });

      // Strip accidental markdown fences
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      let result;
      try {
        result = JSON.parse(cleaned);
      } catch (parseErr) {
        log("WARN", "AI", `JSON parse failed, trying next model`, { model, preview: cleaned.slice(0, 200) });
        lastError = new Error(`JSON parse error from model ${model}: ${parseErr.message}`);
        continue;
      }

      if (typeof result.score !== "number" || !result.verdict || !result.summary) {
        log("WARN", "AI", `Unexpected JSON shape, trying next model`, { model, keys: Object.keys(result) });
        lastError = new Error(`Unexpected JSON shape from model ${model}`);
        continue;
      }

      log("OK", "AI", `Analysis complete`, { model, score: result.score, verdict: result.verdict });
      return result;

    } catch (err) {
      // Only swallow 402/404/429 — re-throw everything else
      if (err.message.includes("402") || err.message.includes("404") || err.message.includes("429")) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error("All models returned empty responses. Please try again.");
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @route  POST /api/ats/analyse
 * @desc   Upload a resume file + job role, get ATS analysis, save to DB
 * @access Private
 * @body   multipart/form-data: file (PDF/DOCX), jobRole (string)
 */
async function analyseResumeController(req, res) {
  log("INFO", "REQUEST", "POST /api/ats/analyse received", {
    user: req.user?.id,
    file: req.file?.originalname,
    size: req.file?.size,
    jobRole: req.body?.jobRole,
  });

  if (!req.file) {
    log("WARN", "REQUEST", "No file in request");
    return res.status(400).json({ message: "Resume file is required" });
  }

  const jobRole = (req.body.jobRole || "").trim();
  if (!jobRole) {
    log("WARN", "REQUEST", "No jobRole in request");
    return res.status(400).json({ message: "Job role is required" });
  }

  try {
    // 1. Extract text
    log("INFO", "EXTRACT", "Extracting text from file", { file: req.file.originalname });
    const resumeText = await extractText(req.file.buffer, req.file.originalname);
    log("OK", "EXTRACT", "Text extracted", { chars: resumeText.length });

    if (!resumeText || resumeText.trim().length < 50) {
      log("WARN", "EXTRACT", "Insufficient text extracted");
      return res.status(422).json({
        message: "Could not extract enough text from the file. Please ensure it is not a scanned image.",
      });
    }

    // 2. Call AI
    const analysis = await analyseWithAI(resumeText, jobRole);

    // 3. Save to DB
    log("INFO", "DB", "Saving ATS result to database", { userId: req.user.id });
    const saved = await atsResultModel.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      jobRole,
      score: Math.min(100, Math.max(0, Math.round(analysis.score))),
      verdict: analysis.verdict,
      summary: analysis.summary,
      metrics: analysis.metrics || { count: 0, examples: [] },
      actionVerbs: analysis.actionVerbs || { strong: [], weak: [] },
      keywords: analysis.keywords || { matched: [], missing: [] },
      formattingIssues: analysis.formattingIssues || [],
      sections: analysis.sections || [],
      recommendations: analysis.recommendations || [],
    });
    log("OK", "DB", "ATS result saved", { id: saved._id, score: saved.score });

    return res.status(201).json({
      message: "ATS analysis complete",
      result: saved,
    });
  } catch (error) {
    log("ERROR", "CONTROLLER", error.message);

    if (error.message.startsWith("Unsupported file type")) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.startsWith("OpenRouter")) {
      return res.status(502).json({ message: "AI service error. Please try again." });
    }
    if (error.message.includes("JSON")) {
      return res.status(502).json({ message: "AI returned an unexpected format. Please try again." });
    }

    return res.status(500).json({ message: "Failed to analyse resume" });
  }
}

/**
 * @route  GET /api/ats
 * @desc   Get all ATS results for the logged-in user (newest first)
 * @access Private
 */
async function getUserATSResultsController(req, res) {
  try {
    const results = await atsResultModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("_id fileName jobRole score verdict createdAt");

    return res.status(200).json({ message: "ATS results fetched", results });
  } catch (error) {
    console.error("Fetch ATS results error:", error.message);
    return res.status(500).json({ message: "Failed to fetch ATS results" });
  }
}

/**
 * @route  GET /api/ats/:id
 * @desc   Get a single ATS result by ID (ownership enforced)
 * @access Private
 */
async function getATSResultByIdController(req, res) {
  try {
    const result = await atsResultModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({ message: "ATS result not found" });
    }

    return res.status(200).json({ message: "ATS result fetched", result });
  } catch (error) {
    console.error("Get ATS result error:", error.message);
    return res.status(500).json({ message: "Failed to fetch ATS result" });
  }
}

/**
 * @route  DELETE /api/ats/:id
 * @desc   Delete an ATS result (ownership enforced)
 * @access Private
 */
async function deleteATSResultController(req, res) {
  try {
    const result = await atsResultModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({ message: "ATS result not found" });
    }

    return res.status(200).json({ message: "ATS result deleted" });
  } catch (error) {
    console.error("Delete ATS result error:", error.message);
    return res.status(500).json({ message: "Failed to delete ATS result" });
  }
}

module.exports = {
  analyseResumeController,
  getUserATSResultsController,
  getATSResultByIdController,
  deleteATSResultController,
};
