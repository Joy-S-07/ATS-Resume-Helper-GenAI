import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AtsResultModel from "@/models/AtsResult";

// ─── OpenRouter config ────────────────────────────────────────────────────────
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Ordered free-model fallback chain
const MODELS = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "deepseek/deepseek-v4-flash:free",
  "openai/gpt-oss-20b:free",
];

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert technical recruiter and ATS (Applicant Tracking System) analyst.
Compare the provided resume text against the target job role.

You MUST output ONLY a valid JSON object — no markdown, no code fences, no explanation.

The JSON must match this exact shape:
{
  "atsScore": number,              // 0-100 overall ATS compatibility score
  "verdict": string,               // "Excellent Match" | "Great Match!" | "Good Start" | "Needs Work" | "Major Issues"
  "summary": string,               // 2-3 sentence paragraph shown under the score
  "matchedKeywords": string[],     // role-relevant keywords found in the resume (up to 15)
  "missingKeywords": string[],     // important role keywords absent from the resume (up to 10)
  "recommendations": string[],     // 4-6 specific, actionable improvement tips
  "metrics": {
    "count": number,               // number of quantifiable achievements found
    "examples": string[]           // up to 5 example phrases from the resume
  },
  "actionVerbs": {
    "strong": string[],            // strong action verbs found (up to 8)
    "weak": string[]               // weak/passive phrases found (up to 5)
  },
  "formattingIssues": [
    { "type": "error" | "warning" | "pass", "message": string }
  ],
  "sections": [
    { "name": string, "present": boolean }
  ]
}

Scoring guide:
- 85-100: Excellent — strong keywords, metrics, formatting, all sections present
- 70-84:  Great — minor gaps
- 55-69:  Good — several improvements needed
- 40-54:  Needs Work — significant gaps
- 0-39:   Major Issues — fundamental problems`;

// ─── Strip markdown fences from LLM output ───────────────────────────────────
function stripMarkdown(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

// ─── Call OpenRouter with fallback chain ─────────────────────────────────────
async function callOpenRouter(resumeText: string, jobRole: string) {
  const userMessage = `Job Role: ${jobRole}\n\nResume Text:\n${resumeText.slice(0, 12000)}`;
  let lastError: Error | null = null;

  for (const model of MODELS) {
    console.log(`ℹ️  [analyze] Trying model: ${model}`);

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5174",
        "X-Title": "ATS Resume Helper",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    console.log(`ℹ️  [analyze] OpenRouter status: ${response.status} (${model})`);

    // 402 = out of credits, 404 = model unavailable, 429 = rate limited — try next
    if (response.status === 402 || response.status === 404 || response.status === 429) {
      lastError = new Error(`Model ${model} unavailable (${response.status})`);
      console.warn(`⚠️  [analyze] ${lastError.message}, trying next...`);
      continue;
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const rawContent: string | undefined = data.choices?.[0]?.message?.content;

    console.log(`ℹ️  [analyze] choices length: ${data.choices?.length ?? 0}, content length: ${rawContent?.length ?? 0}`);

    if (!rawContent || rawContent.trim() === "") {
      lastError = new Error(`Empty content from model ${model}`);
      console.warn(`⚠️  [analyze] ${lastError.message}, trying next...`);
      continue;
    }

    const cleaned = stripMarkdown(rawContent);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      lastError = new Error(`JSON parse failed for model ${model}: ${(e as Error).message}`);
      console.warn(`⚠️  [analyze] ${lastError.message}`);
      console.warn(`⚠️  [analyze] Raw preview: ${cleaned.slice(0, 300)}`);
      continue;
    }

    if (typeof parsed.atsScore !== "number" || !parsed.verdict || !parsed.summary) {
      lastError = new Error(`Unexpected JSON shape from model ${model}`);
      console.warn(`⚠️  [analyze] ${lastError.message}, keys: ${Object.keys(parsed).join(", ")}`);
      continue;
    }

    console.log(`✅ [analyze] Success with model: ${model}, score: ${parsed.atsScore}`);
    return parsed;
  }

  throw lastError ?? new Error("All models returned empty or invalid responses");
}

// ─── POST /api/analyze ───────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  console.log(`ℹ️  [analyze] POST /api/analyze received`);

  try {
    // 1. Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const jobRole = (formData.get("jobRole") as string | null)?.trim();

    console.log(`ℹ️  [analyze] file: ${file?.name ?? "none"} (${file?.size ?? 0} bytes), jobRole: "${jobRole}"`);

    if (!file) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }
    if (!jobRole) {
      return NextResponse.json({ error: "Job role is required" }, { status: 400 });
    }

    // 2. Convert File → Uint8Array → extract text with pdfjs-dist
    console.log(`ℹ️  [analyze] Extracting text from PDF...`);
    const arrayBuffer = await file.arrayBuffer();

    let extractedText = "";
    try {
      const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

      // disableWorker:true is the correct flag for Node.js server environments.
      // Cast to any because the TypeScript overload for `data:` doesn't expose it,
      // but the runtime accepts it and it's the documented server-side approach.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loadingTask = getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
      } as any);

      const pdfDoc = await loadingTask.promise;
      console.log(`ℹ️  [analyze] PDF loaded: ${pdfDoc.numPages} pages`);

      const textParts: string[] = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ("str" in item ? (item as { str: string }).str : ""))
          .join(" ");
        textParts.push(pageText);
      }

      extractedText = textParts.join("\n");
      console.log(`✅ [analyze] PDF text extracted: ${extractedText.length} chars`);
    } catch (pdfErr) {
      const errMsg = pdfErr instanceof Error ? pdfErr.message : String(pdfErr);
      console.error(`❌ [analyze] pdfjs-dist failed: ${errMsg}`);
      return NextResponse.json(
        { error: `Could not parse the PDF: ${errMsg}` },
        { status: 422 }
      );
    }

    if (extractedText.trim().length < 50) {
      return NextResponse.json(
        { error: "Not enough text found in the PDF. Please upload a text-based resume." },
        { status: 422 }
      );
    }

    // 3. Call OpenRouter AI
    console.log(`ℹ️  [analyze] Calling OpenRouter AI...`);
    const analysis = await callOpenRouter(extractedText, jobRole);

    // 4. Save to MongoDB
    console.log(`ℹ️  [analyze] Saving result to MongoDB...`);
    await connectDB();

    const saved = await AtsResultModel.create({
      jobRole,
      fileName: file.name,
      atsScore: Math.min(100, Math.max(0, Math.round(analysis.atsScore as number))),
      verdict: analysis.verdict as string,
      summary: analysis.summary as string,
      missingKeywords: (analysis.missingKeywords as string[]) ?? [],
      matchedKeywords: (analysis.matchedKeywords as string[]) ?? [],
      recommendations: (analysis.recommendations as string[]) ?? [],
      metrics: (analysis.metrics as object) ?? { count: 0, examples: [] },
      actionVerbs: (analysis.actionVerbs as object) ?? { strong: [], weak: [] },
      formattingIssues: (analysis.formattingIssues as object[]) ?? [],
      sections: (analysis.sections as object[]) ?? [],
    });

    console.log(`✅ [analyze] Saved to DB: ${saved._id}, score: ${saved.atsScore}`);

    // 5. Return the saved document
    return NextResponse.json({ result: saved }, { status: 201 });

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ [analyze] Unhandled error:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
