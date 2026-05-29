import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * POST /api/resume/:id/regenerate-latex - Regenerate LaTeX code for a resume
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const { id } = params;

    const response = await fetch(`${EXPRESS_API_URL}/api/resume/${id}/regenerate-latex`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
    });

    const text = await response.text();
    let data: any;
    try { data = JSON.parse(text); } catch {
      return NextResponse.json({ message: "Unexpected response from server" }, { status: 502 });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ [RESUME:PROXY] POST /api/resume/:id/regenerate-latex error:", error.message);
    return NextResponse.json({ message: `Proxy error: ${error.message}` }, { status: 500 });
  }
}
