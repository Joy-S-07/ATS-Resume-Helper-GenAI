import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * POST /api/resume/generate - Generate resume from manual form data
 */
export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const body = await request.json();

    console.log("ℹ️  [RESUME:PROXY] Forwarding generate to:", `${EXPRESS_API_URL}/api/resume/generate`);

    const response = await fetch(`${EXPRESS_API_URL}/api/resume/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log("ℹ️  [RESUME:PROXY] Express responded:", response.status, text.slice(0, 200));

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ [RESUME:PROXY] Non-JSON response:", text.slice(0, 500));
      return NextResponse.json({ message: "Unexpected response from server" }, { status: 502 });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ [RESUME:PROXY] POST /api/resume/generate error:", error.message);
    return NextResponse.json({ message: `Proxy error: ${error.message}` }, { status: 500 });
  }
}
