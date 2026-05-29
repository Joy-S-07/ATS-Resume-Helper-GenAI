import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * POST /api/resume/compile
 * Sends resumeData to Express, receives a PDF blob, streams it back to the browser.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const body = await request.json();

    console.log("ℹ️  [RESUME:PROXY] Forwarding compile to Express...");

    const response = await fetch(`${EXPRESS_API_URL}/api/resume/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      let msg = "Failed to generate PDF";
      try { msg = JSON.parse(text).message || msg; } catch {}
      return NextResponse.json({ message: msg }, { status: response.status });
    }

    // Stream the PDF bytes back
    const pdfBuffer = await response.arrayBuffer();
    const name = (body?.resumeData?.personalInfo?.name || "resume")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${name}_resume.pdf"`,
        "Content-Length": String(pdfBuffer.byteLength),
      },
    });
  } catch (error: any) {
    console.error("❌ [RESUME:PROXY] compile error:", error.message);
    return NextResponse.json({ message: `Proxy error: ${error.message}` }, { status: 500 });
  }
}
