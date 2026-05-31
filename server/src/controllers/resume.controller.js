const resumeModel = require("../models/resume.model");
const { extractText } = require("../utils/extractText");
const { buildResumeHtml } = require("../utils/buildResumeHtml");
const puppeteer = require("puppeteer");

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
  console.log(`${icons[level] || "  "} [${ts}] [RESUME:${context}] ${message}${extraStr}`);
}

/**
 * Generate ATS-optimised LaTeX from structured resume data.
 * Uses the resume-tailoring skill principles: truth-preserving optimisation,
 * keyword alignment, and role-specific emphasis.
 */
async function generateLatexFromData(resumeData, templateStyle = "modern", targetRole = "") {
  const roleContext = targetRole
    ? `The candidate is applying for: "${targetRole}". Tailor the resume specifically for this role — emphasise relevant skills, reframe experience descriptions to match the role's language, and ensure ATS keyword density for this position.`
    : "Generate a general-purpose professional resume.";

  const prompt = `You are an expert ATS resume writer and LaTeX typesetter following the resume-tailoring principle: truth-preserving optimisation — maximise job fit while maintaining factual integrity. Never fabricate experience, but intelligently reframe and emphasise relevant aspects.

${roleContext}

Template Style: ${templateStyle}
Resume Data:
${JSON.stringify(resumeData, null, 2)}

ATS Optimisation Rules:
1. Mirror exact keywords and phrases from the target role in bullet points where truthful
2. Lead every experience bullet with a strong action verb (Engineered, Delivered, Led, Reduced, Increased…)
3. Quantify achievements wherever data is available (%, $, time saved, team size)
4. Place the most role-relevant experience bullets first within each position
5. Include a concise Professional Summary (2-3 sentences) that names the target role and top 3 matching strengths
6. Skills section must list hard skills first, grouped by category relevant to the role
7. Keep the document to 1 page if experience < 5 years, 2 pages otherwise

LaTeX Requirements:
- Use: \\documentclass[letterpaper,11pt]{article} with geometry, enumitem, hyperref, titlesec, xcolor
- Clean single or two-column layout matching the "${templateStyle}" style
- ATS-safe: no tables for layout, no text boxes, no graphics — plain text sections only
- Consistent spacing, readable at 11pt
- Return ONLY the complete LaTeX source code — no markdown fences, no explanations`;

  const systemContent = "You are an expert ATS resume writer and LaTeX typesetter. Return ONLY raw LaTeX source code. No markdown, no explanations, no code fences.";

  let lastError = null;

  for (const model of MODELS) {
    log("INFO", "AI", `Trying model: ${model}`, { targetRole: targetRole || "none" });

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
          "X-Title": "ATS Resume Helper - Resume Builder",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
          max_tokens: 4096,
        }),
      });

      log("INFO", "AI", `OpenRouter responded`, { model, status: response.status });

      if (response.status === 402 || response.status === 404 || response.status === 429) {
        const errText = await response.text();
        log("WARN", "AI", `Model unavailable, trying next`, { model, status: response.status });
        lastError = new Error(`OpenRouter API error ${response.status}: ${errText}`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;

      if (!rawContent || rawContent.trim() === "") {
        log("WARN", "AI", `Empty content from model, trying next`, { model });
        lastError = new Error(`Empty response from model ${model}`);
        continue;
      }

      // Strip any accidental markdown fences
      const latexCode = rawContent
        .replace(/^```(?:latex|tex)?\s*/im, "")
        .replace(/\s*```\s*$/im, "")
        .trim();

      log("OK", "AI", `LaTeX generated`, { model, chars: latexCode.length, targetRole: targetRole || "none" });
      return latexCode;

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

/**
 * Structure extracted text into resume data using AI
 */
async function structureResumeText(extractedText) {
  const prompt = `You are an expert resume parser. Extract and structure the following resume text into a JSON object.

Resume Text:
${extractedText}

Return a JSON object with this exact structure:
{
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "title": "string"
  },
  "summary": "string",
  "softSkills": [{"name": "string"}],
  "languages": [{"name": "string"}],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "duration": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string"
    }
  ],
  "references": [
    {
      "name": "string",
      "contact": "string"
    }
  ]
}

Return ONLY valid JSON, no markdown formatting or explanations.`;

  const systemContent = "You are an expert resume parser. Extract structured data from resume text and return ONLY valid JSON without any markdown formatting.";

  let lastError = null;

  for (const model of MODELS) {
    log("INFO", "PARSER", `Trying model: ${model}`);

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
          "X-Title": "ATS Resume Helper - Resume Parser",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      log("INFO", "PARSER", `OpenRouter responded`, { model, status: response.status });

      // 402 = out of credits, 404 = model unavailable, 429 = rate limited — try next
      if (response.status === 402 || response.status === 404 || response.status === 429) {
        const errText = await response.text();
        log("WARN", "PARSER", `Model unavailable or out of credits, trying next`, { model, status: response.status });
        lastError = new Error(`OpenRouter API error ${response.status}: ${errText}`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;

      if (!rawContent || rawContent.trim() === "") {
        log("WARN", "PARSER", `Empty content from model, trying next`, { model });
        lastError = new Error(`Empty response from model ${model}`);
        continue;
      }

      // Strip markdown code blocks if present
      let jsonString = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      let structuredData;
      try {
        structuredData = JSON.parse(jsonString);
      } catch (parseErr) {
        log("WARN", "PARSER", `JSON parse failed, trying next model`, { model, preview: jsonString.slice(0, 200) });
        lastError = new Error(`JSON parse error from model ${model}`);
        continue;
      }

      log("OK", "PARSER", `Resume text structured successfully`, { model });
      return structuredData;

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

/**
 * @route POST /api/resume/upload
 * @description Upload resume file (PDF/DOCX), extract text, structure it with AI, generate LaTeX
 * @access Private
 */
async function uploadResumeController(req, res) {
  console.log("ℹ️ INFO [RESUME:UPLOAD] Processing resume upload...");

  try {
    const userId = req.user.id;
    const file = req.file;
    const { templateStyle = "modern", targetRole = "" } = req.body;

    if (!file) {
      log("WARN", "UPLOAD", "No file provided");
      return res.status(400).json({ message: "No file uploaded" });
    }

    log("INFO", "UPLOAD", `Extracting text from ${file.originalname}`, { targetRole: targetRole || "none" });
    
    // Extract text from uploaded file
    const extractedText = await extractText(file.buffer, file.originalname);

    if (!extractedText || extractedText.trim().length < 50) {
      log("WARN", "UPLOAD", "Insufficient text extracted");
      return res.status(400).json({
        message: "Could not extract sufficient text from the file. Please ensure it's a text-based (not scanned) document.",
      });
    }

    log("OK", "UPLOAD", `Extracted ${extractedText.length} characters`);
    log("INFO", "UPLOAD", "Structuring resume data with AI...");

    // Structure the extracted text using AI
    const structuredData = await structureResumeText(extractedText);

    log("INFO", "UPLOAD", "Generating ATS-optimised LaTeX...", { targetRole: targetRole || "none" });

    // Generate LaTeX code from structured data, tailored to target role
    const latexCode = await generateLatexFromData(structuredData, templateStyle, targetRole);

    // Save to database
    const resume = new resumeModel({
      userId,
      source: "upload",
      templateStyle,
      targetRole,
      resumeData: structuredData,
      latexCode,
      extractedText,
    });

    await resume.save();

    log("OK", "UPLOAD", `Resume saved (ID: ${resume._id})`);

    return res.status(201).json({
      message: "Resume uploaded and processed successfully",
      resume: {
        _id: resume._id,
        source: resume.source,
        templateStyle: resume.templateStyle,
        resumeData: resume.resumeData,
        latexCode: resume.latexCode,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ ERROR [RESUME:UPLOAD]", error.message);

    if (error.message.includes("OpenRouter") || error.message.includes("All models")) {
      return res.status(502).json({
        message: "AI service error. Please try again.",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to process resume upload",
      error: error.message,
    });
  }
}

/**
 * @route POST /api/resume/generate
 * @description Generate resume from manual form data
 * @access Private
 */
async function generateFromFormController(req, res) {
  log("INFO", "GENERATE", "Generating resume from form data...");

  try {
    const userId = req.user.id;
    const { resumeData, templateStyle = "modern", targetRole = "" } = req.body;

    if (!resumeData || !resumeData.personalInfo) {
      log("WARN", "GENERATE", "Invalid resume data");
      return res.status(400).json({ message: "Resume data is required" });
    }

    log("INFO", "GENERATE", "Generating ATS-optimised LaTeX...", { targetRole: targetRole || "none" });

    // Generate LaTeX code tailored to the target role
    const latexCode = await generateLatexFromData(resumeData, templateStyle, targetRole);

    // Save to database
    const resume = new resumeModel({
      userId,
      source: "manual",
      templateStyle,
      targetRole,
      resumeData,
      latexCode,
    });

    await resume.save();

    log("OK", "GENERATE", `Resume saved (ID: ${resume._id})`, { targetRole: targetRole || "none" });

    return res.status(201).json({
      message: "Resume generated successfully",
      resume: {
        _id: resume._id,
        source: resume.source,
        templateStyle: resume.templateStyle,
        resumeData: resume.resumeData,
        latexCode: resume.latexCode,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ ERROR [RESUME:GENERATE]", error.message);

    if (error.message.includes("OpenRouter") || error.message.includes("All models")) {
      return res.status(502).json({
        message: "AI service error. Please try again.",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to generate resume",
      error: error.message,
    });
  }
}

/**
 * @route GET /api/resume/list
 * @description Get all resumes for the logged-in user
 * @access Private
 */
async function getUserResumesController(req, res) {
  console.log("ℹ️ INFO [RESUME:LIST] Fetching user resumes...");

  try {
    const userId = req.user.id;

    const resumes = await resumeModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .select("-extractedText -__v");

    console.log(`✅ OK [RESUME:LIST] Found ${resumes.length} resumes`);

    return res.status(200).json({
      message: "Resumes fetched successfully",
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("❌ ERROR [RESUME:LIST]", error.message);
    return res.status(500).json({
      message: "Failed to fetch resumes",
      error: error.message,
    });
  }
}

/**
 * @route GET /api/resume/:id
 * @description Get a single resume by ID
 * @access Private
 */
async function getResumeByIdController(req, res) {
  console.log(`ℹ️ INFO [RESUME:GET] Fetching resume ${req.params.id}...`);

  try {
    const userId = req.user.id;
    const { id } = req.params;

    const resume = await resumeModel.findOne({ _id: id, userId }).select("-__v");

    if (!resume) {
      console.log("⚠️ WARN [RESUME:GET] Resume not found");
      return res.status(404).json({ message: "Resume not found" });
    }

    console.log(`✅ OK [RESUME:GET] Resume fetched successfully`);

    return res.status(200).json({
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    console.error("❌ ERROR [RESUME:GET]", error.message);
    return res.status(500).json({
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
}

/**
 * @route PUT /api/resume/:id
 * @description Update resume (LaTeX code, resume data, or template style)
 * @access Private
 */
async function updateResumeController(req, res) {
  console.log(`ℹ️ INFO [RESUME:UPDATE] Updating resume ${req.params.id}...`);

  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { latexCode, resumeData, templateStyle } = req.body;

    const resume = await resumeModel.findOne({ _id: id, userId });

    if (!resume) {
      console.log("⚠️ WARN [RESUME:UPDATE] Resume not found");
      return res.status(404).json({ message: "Resume not found" });
    }

    // Update fields if provided
    if (latexCode !== undefined) resume.latexCode = latexCode;
    if (resumeData !== undefined) resume.resumeData = resumeData;
    if (templateStyle !== undefined) resume.templateStyle = templateStyle;

    await resume.save();

    console.log(`✅ OK [RESUME:UPDATE] Resume updated successfully`);

    return res.status(200).json({
      message: "Resume updated successfully",
      resume: {
        _id: resume._id,
        source: resume.source,
        templateStyle: resume.templateStyle,
        resumeData: resume.resumeData,
        latexCode: resume.latexCode,
        updatedAt: resume.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ ERROR [RESUME:UPDATE]", error.message);
    return res.status(500).json({
      message: "Failed to update resume",
      error: error.message,
    });
  }
}

/**
 * @route DELETE /api/resume/:id
 * @description Delete a resume
 * @access Private
 */
async function deleteResumeController(req, res) {
  console.log(`ℹ️ INFO [RESUME:DELETE] Deleting resume ${req.params.id}...`);

  try {
    const userId = req.user.id;
    const { id } = req.params;

    const resume = await resumeModel.findOneAndDelete({ _id: id, userId });

    if (!resume) {
      console.log("⚠️ WARN [RESUME:DELETE] Resume not found");
      return res.status(404).json({ message: "Resume not found" });
    }

    console.log(`✅ OK [RESUME:DELETE] Resume deleted successfully`);

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("❌ ERROR [RESUME:DELETE]", error.message);
    return res.status(500).json({
      message: "Failed to delete resume",
      error: error.message,
    });
  }
}

/**
 * @route POST /api/resume/compile
 * @description Render resume data to an A4 PDF using Puppeteer + HTML template
 * @access Private
 * @body { resumeData, targetRole? }
 */
async function compileLatexController(req, res) {
  log("INFO", "COMPILE", "Rendering resume to PDF...");

  let browser;
  try {
    const { resumeData, targetRole = "" } = req.body;

    if (!resumeData || !resumeData.personalInfo) {
      log("WARN", "COMPILE", "No resume data provided");
      return res.status(400).json({ message: "resumeData is required" });
    }

    // Build the HTML
    const html = buildResumeHtml(resumeData, targetRole);
    log("INFO", "COMPILE", "HTML built, launching Puppeteer...");

    browser = await puppeteer.launch({
      headless: true,   // "new" deadlocks on Windows — use legacy headless mode
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--allow-file-access-from-files",
      ],
    });

    const page = await browser.newPage();
    // domcontentloaded is safe for data: URLs; networkidle0 can hang
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    // Let fonts/layout settle
    await new Promise((r) => setTimeout(r, 400));

    const pdfRaw = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    });

    // Puppeteer v22+ returns Uint8Array instead of Buffer.
    // Express res.send() serializes Uint8Array as JSON {"0":37,...} — convert to Buffer first.
    const pdfBuffer = Buffer.from(pdfRaw);

    await browser.close();
    browser = null;

    const name = (resumeData.personalInfo?.name || "resume")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");

    log("OK", "COMPILE", `PDF generated (${pdfBuffer.length} bytes)`);

    // Do NOT set Content-Length manually — Express calculates it correctly
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}_resume.pdf"`,
    });

    return res.send(pdfBuffer);

  } catch (error) {
    if (browser) {
      try { await browser.close(); } catch (_) {}
    }
    log("ERROR", "COMPILE", error.message);
    return res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
}

/**
 * @route POST /api/resume/upload-photo
 * @description Upload a profile photo and return its base64 data URL
 * @access Private
 */
async function uploadPhotoController(req, res) {
  log("INFO", "PHOTO", "Profile photo upload received");

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Only JPEG, PNG, WebP, or GIF images are allowed" });
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

    log("OK", "PHOTO", `Photo encoded (${req.file.size} bytes)`);
    return res.status(200).json({ photoUrl: dataUrl });

  } catch (error) {
    log("ERROR", "PHOTO", error.message);
    return res.status(500).json({ message: "Failed to upload photo", error: error.message });
  }
}

module.exports = {
  uploadResumeController,
  generateFromFormController,
  getUserResumesController,
  getResumeByIdController,
  updateResumeController,
  deleteResumeController,
  compileLatexController,
  uploadPhotoController,
};
