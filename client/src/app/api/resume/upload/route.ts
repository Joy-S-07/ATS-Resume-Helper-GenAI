import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * POST /api/resume/upload - Upload PDF/DOCX resume
 *
 * Forwards the raw multipart body as-is to Express (same pattern as /api/ats).
 * Do NOT parse FormData here — re-serializing it corrupts the boundary.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const contentType = request.headers.get("content-type") || "";

    console.log("ℹ️  [RESUME:PROXY] Forwarding upload to:", `${EXPRESS_API_URL}/api/resume/upload`);
    console.log("ℹ️  [RESUME:PROXY] Content-Type:", contentType);

    // Forward the raw body bytes — do NOT call request.formData()
    const body = await request.arrayBuffer();

    const response = await fetch(`${EXPRESS_API_URL}/api/resume/upload`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Cookie: cookieHeader,
      },
      body: Buffer.from(body),
    });

    const text = await response.text();
    console.log("ℹ️  [RESUME:PROXY] Express responded:", response.status, text.slice(0, 300));

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ [RESUME:PROXY] Non-JSON response from Express:", text.slice(0, 500));
      return NextResponse.json(
        { message: "Unexpected response from server. Check Express logs." },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ [RESUME:PROXY] POST /api/resume/upload error:", error.message);
    return NextResponse.json(
      { message: `Proxy error: ${error.message}` },
      { status: 500 }
    );
  }
}
