const resumeModel = require("../models/resume.model");
const { extractText } = require("../utils/extractText");

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
 * Generate LaTeX code from structured resume data using AI
 */
async function generateLatexFromData(resumeData, templateStyle = "modern") {
  const prompt = `You are an expert LaTeX resume generator. Generate a professional, ATS-friendly LaTeX resume code based on the following data.

Template Style: ${templateStyle}
Resume Data:
${JSON.stringify(resumeData, null, 2)}

Requirements:
1. Use standard LaTeX resume packages (article, fullpage, titlesec, enumitem, hyperref)
2. Create a clean, professional layout optimized for ATS parsing
3. Include all provided information in a well-structured format
4. Use appropriate sections: Contact Info, Summary, Experience, Education, Skills, Languages, References
5. Make it visually appealing while maintaining ATS compatibility
6. Return ONLY the LaTeX code, no explanations or markdown formatting

Generate the complete LaTeX document now:`;

  const systemContent = "You are an expert LaTeX resume generator. Generate clean, professional, ATS-friendly LaTeX code. Return ONLY the LaTeX code without any markdown formatting or explanations.";

  let lastError = null;

  for (const model of MODELS) {
    log("INFO", "AI", `Trying model: ${model}`);

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
          temperature: 0.7,
          max_tokens: 3000,
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
      const rawContent = data.choices?.[0]?.message?.content;

      if (!rawContent || rawContent.trim() === "") {
        log("WARN", "AI", `Empty content from model, trying next`, { model });
        lastError = new Error(`Empty response from model ${model}`);
        continue;
      }

      // Strip markdown code blocks if present
      let latexCode = rawContent.replace(/```latex\n?/g, "").replace(/```\n?/g, "").trim();

      log("OK", "AI", `LaTeX code generated successfully`, { model, chars: latexCode.length });
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
    const { templateStyle = "modern" } = req.body;

    if (!file) {
      console.log("⚠️ WARN [RESUME:UPLOAD] No file provided");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log(`ℹ️ INFO [RESUME:UPLOAD] Extracting text from ${file.originalname}...`);
    
    // Extract text from uploaded file
    const extractedText = await extractText(file.buffer, file.originalname);

    if (!extractedText || extractedText.trim().length < 50) {
      console.log("⚠️ WARN [RESUME:UPLOAD] Insufficient text extracted");
      return res.status(400).json({
        message: "Could not extract sufficient text from the file. Please ensure it's a text-based (not scanned) document.",
      });
    }

    console.log(`✅ OK [RESUME:UPLOAD] Extracted ${extractedText.length} characters`);
    console.log("ℹ️ INFO [RESUME:UPLOAD] Structuring resume data with AI...");

    // Structure the extracted text using AI
    const structuredData = await structureResumeText(extractedText);

    console.log("ℹ️ INFO [RESUME:UPLOAD] Generating LaTeX code...");

    // Generate LaTeX code from structured data
    const latexCode = await generateLatexFromData(structuredData, templateStyle);

    // Save to database
    const resume = new resumeModel({
      userId,
      source: "upload",
      templateStyle,
      resumeData: structuredData,
      latexCode,
      extractedText,
    });

    await resume.save();

    console.log(`✅ OK [RESUME:UPLOAD] Resume saved successfully (ID: ${resume._id})`);

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
  console.log("ℹ️ INFO [RESUME:GENERATE] Generating resume from form data...");

  try {
    const userId = req.user.id;
    const { resumeData, templateStyle = "modern" } = req.body;

    if (!resumeData || !resumeData.personalInfo) {
      console.log("⚠️ WARN [RESUME:GENERATE] Invalid resume data");
      return res.status(400).json({ message: "Resume data is required" });
    }

    console.log("ℹ️ INFO [RESUME:GENERATE] Generating LaTeX code with AI...");

    // Generate LaTeX code from form data
    const latexCode = await generateLatexFromData(resumeData, templateStyle);

    // Save to database
    const resume = new resumeModel({
      userId,
      source: "manual",
      templateStyle,
      resumeData,
      latexCode,
    });

    await resume.save();

    console.log(`✅ OK [RESUME:GENERATE] Resume generated successfully (ID: ${resume._id})`);

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
 * @description Compile LaTeX to PDF (placeholder - requires external service or local LaTeX installation)
 * @access Private
 */
async function compileLatexController(req, res) {
  console.log("ℹ️ INFO [RESUME:COMPILE] Compiling LaTeX to PDF...");

  try {
    const { latexCode } = req.body;

    if (!latexCode) {
      console.log("⚠️ WARN [RESUME:COMPILE] No LaTeX code provided");
      return res.status(400).json({ message: "LaTeX code is required" });
    }

    // TODO: Implement LaTeX compilation
    // Options:
    // 1. Use external service like LaTeX.Online API
    // 2. Use local LaTeX installation with child_process
    // 3. Return LaTeX for client-side compilation

    console.log("⚠️ WARN [RESUME:COMPILE] LaTeX compilation not yet implemented");

    return res.status(501).json({
      message: "LaTeX compilation not yet implemented. Use an external service or download the LaTeX code.",
      latexCode,
    });
  } catch (error) {
    console.error("❌ ERROR [RESUME:COMPILE]", error.message);
    return res.status(500).json({
      message: "Failed to compile LaTeX",
      error: error.message,
    });
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
};
