import { NextRequest } from "next/server";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * POST /api/resume/compile
 * Forwards to Express, receives a PDF, passes raw bytes back to the browser.
 *
 * Key: use the native `Response` constructor (not NextResponse) so Next.js
 * does NOT re-encode the binary buffer as UTF-8.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const body = await request.json();

    console.log("ℹ️  [RESUME:PROXY] Forwarding compile to Express...");

    const upstream = await fetch(`${EXPRESS_API_URL}/api/resume/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      let msg = "Failed to generate PDF";
      try { msg = JSON.parse(text).message || msg; } catch {}
      return new Response(JSON.stringify({ message: msg }), {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const name = (body?.resumeData?.personalInfo?.name || "resume")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");

    const contentDisposition =
      upstream.headers.get("Content-Disposition") ||
      `attachment; filename="${name}_resume.pdf"`;

    console.log(`✅ [RESUME:PROXY] Piping PDF stream to client`);

    // Pipe the ReadableStream directly — never buffer in the proxy so Next.js
    // cannot re-encode the binary body on the way out.
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error: any) {
    console.error("❌ [RESUME:PROXY] compile error:", error.message);
    return new Response(JSON.stringify({ message: `Proxy error: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
