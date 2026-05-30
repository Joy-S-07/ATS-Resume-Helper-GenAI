const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");

// ─── OpenRouter config ────────────────────────────────────────────────────────
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODELS = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "deepseek/deepseek-v4-flash:free",
  "openai/gpt-oss-20b:free",
];

// ─── Logger ───────────────────────────────────────────────────────────────────
function log(level, ctx, msg, extra = {}) {
  const ts = new Date().toISOString();
  const ex = Object.keys(extra).length
    ? " | " + Object.entries(extra).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(" ")
    : "";
  const icons = { INFO: "ℹ️ ", OK: "✅", WARN: "⚠️ ", ERROR: "❌" };
  console.log(`${icons[level] || "  "} [${ts}] [INTERVIEW:${ctx}] ${msg}${ex}`);
}

// ─── ElevenLabs client (lazy — only created when API key is present) ──────────
function getElevenLabs() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set in .env");
  return new ElevenLabsClient({ apiKey: key });
}

// ─── OpenRouter helper ────────────────────────────────────────────────────────
async function callOpenRouter(messages, maxTokens = 1024) {
  let lastError = null;
  for (const model of MODELS) {
    try {
      const res = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
          "X-Title": "ATS Resume Helper - Interview",
        },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: maxTokens }),
      });

      if (res.status === 402 || res.status === 404 || res.status === 429) {
        log("WARN", "AI", `Model unavailable`, { model, status: res.status });
        lastError = new Error(`Model ${model} unavailable (${res.status})`);
        continue;
      }
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`OpenRouter ${res.status}: ${t}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        lastError = new Error(`Empty response from ${model}`);
        continue;
      }
      return content;
    } catch (err) {
      if (err.message.includes("402") || err.message.includes("404") || err.message.includes("429")) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }
  throw lastError || new Error("All models failed");
}

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/interview/questions
 * Generate interview questions for a given role, seniority, and focus area.
 * Returns an array of question strings.
 */
async function generateQuestionsController(req, res) {
  const { jobTitle, company, seniority, focus, count = 8 } = req.body;

  log("INFO", "QUESTIONS", "Generating questions", { jobTitle, seniority, focus });

  if (!jobTitle?.trim()) {
    return res.status(400).json({ message: "jobTitle is required" });
  }

  const systemPrompt = `You are an expert technical interviewer at a top-tier tech company.
Generate exactly ${count} interview questions for the role described.
Return ONLY a valid JSON array of strings — no markdown, no numbering, no explanation.
Example: ["Question 1?", "Question 2?"]`;

  const userPrompt = `Role: ${seniority || "Mid-Level"} ${jobTitle}${company ? ` at ${company}` : ""}
Focus: ${focus || "Mixed"}
Generate ${count} ${focus?.toLowerCase() || "mixed"} interview questions appropriate for this seniority level.`;

  try {
    const raw = await callOpenRouter(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      1024
    );

    // Strip markdown fences if present
    const cleaned = raw.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
      if (!Array.isArray(questions)) throw new Error("Not an array");
    } catch {
      // Fallback: split by newlines if JSON parse fails
      questions = cleaned
        .split(/\n+/)
        .map((q) => q.replace(/^\d+[\.\)]\s*/, "").replace(/^["']|["']$/g, "").trim())
        .filter(Boolean)
        .slice(0, count);
    }

    log("OK", "QUESTIONS", `Generated ${questions.length} questions`);
    return res.status(200).json({ questions });
  } catch (err) {
    log("ERROR", "QUESTIONS", err.message);
    return res.status(500).json({ message: "Failed to generate questions", error: err.message });
  }
}

/**
 * POST /api/interview/respond
 * Given the conversation history + user's answer, generate the AI interviewer's next response.
 * Returns { text: string } — the AI's next question/follow-up.
 */
async function generateResponseController(req, res) {
  const { jobTitle, seniority, focus, company, history, userAnswer } = req.body;

  log("INFO", "RESPOND", "Generating AI response", { jobTitle });

  if (!userAnswer?.trim()) {
    return res.status(400).json({ message: "userAnswer is required" });
  }

  const systemPrompt = `You are a professional AI interviewer conducting a ${focus || "mixed"} interview for a ${seniority || "Mid-Level"} ${jobTitle}${company ? ` at ${company}` : ""} position.

Your behaviour:
- Ask one focused follow-up question or transition to the next topic
- Be concise (2-4 sentences max)
- Sound natural and conversational, not robotic
- Probe for specifics: metrics, challenges, decisions, outcomes
- Do NOT repeat questions already asked
- Do NOT provide feedback or evaluation during the interview
- Keep the interview flowing naturally`;

  // Build messages from history
  const messages = [{ role: "system", content: systemPrompt }];

  if (Array.isArray(history)) {
    for (const msg of history) {
      if (msg.role === "ai") messages.push({ role: "assistant", content: msg.content });
      else if (msg.role === "user") messages.push({ role: "user", content: msg.content });
    }
  }

  messages.push({ role: "user", content: userAnswer });

  try {
    const responseText = await callOpenRouter(messages, 256);
    log("OK", "RESPOND", "AI response generated");
    return res.status(200).json({ text: responseText });
  } catch (err) {
    log("ERROR", "RESPOND", err.message);
    return res.status(500).json({ message: "Failed to generate response", error: err.message });
  }
}

/**
 * POST /api/interview/tts
 * Convert text to speech using ElevenLabs.
 * Returns audio/mpeg stream.
 */
async function textToSpeechController(req, res) {
  const { text, voiceId } = req.body;

  log("INFO", "TTS", "Converting text to speech", { chars: text?.length });

  if (!text?.trim()) {
    return res.status(400).json({ message: "text is required" });
  }

  try {
    const client = getElevenLabs();

    // Default to a professional male voice; user can override
    const voice = voiceId || process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";

    const audioStream = await client.textToSpeech.convert(voice, {
      text: text.trim(),
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
    });

    res.set({
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    });

    // Pipe the readable stream directly to the response
    for await (const chunk of audioStream) {
      res.write(chunk);
    }
    res.end();

    log("OK", "TTS", "Audio streamed successfully");
  } catch (err) {
    log("ERROR", "TTS", err.message);
    if (!res.headersSent) {
      return res.status(500).json({ message: "TTS failed", error: err.message });
    }
  }
}

/**
 * POST /api/interview/feedback
 * Analyse the full interview transcript and return structured feedback.
 */
async function generateFeedbackController(req, res) {
  const { jobTitle, seniority, focus, history } = req.body;

  log("INFO", "FEEDBACK", "Generating interview feedback", { jobTitle });

  if (!Array.isArray(history) || history.length < 2) {
    return res.status(400).json({ message: "history with at least 2 messages is required" });
  }

  const transcript = history
    .map((m) => `${m.role === "ai" ? "Interviewer" : "Candidate"}: ${m.content}`)
    .join("\n\n");

  const systemPrompt = `You are an expert interview coach. Analyse the interview transcript and return structured feedback as valid JSON.

Return ONLY this JSON structure, no markdown:
{
  "overallScore": number (0-100),
  "summary": "2-3 sentence overall assessment",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area 1", "area 2", "area 3"],
  "questionScores": [
    { "question": "...", "score": number, "feedback": "..." }
  ],
  "recommendation": "Hire" | "Consider" | "Pass"
}`;

  const userPrompt = `Interview for: ${seniority || "Mid-Level"} ${jobTitle}
Focus: ${focus || "Mixed"}

Transcript:
${transcript}`;

  try {
    const raw = await callOpenRouter(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      2048
    );

    const cleaned = raw.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();

    let feedback;
    try {
      feedback = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ message: "AI returned invalid feedback format. Please try again." });
    }

    log("OK", "FEEDBACK", `Feedback generated, score: ${feedback.overallScore}`);
    return res.status(200).json({ feedback });
  } catch (err) {
    log("ERROR", "FEEDBACK", err.message);
    return res.status(500).json({ message: "Failed to generate feedback", error: err.message });
  }
}

module.exports = {
  generateQuestionsController,
  generateResponseController,
  textToSpeechController,
  generateFeedbackController,
};
