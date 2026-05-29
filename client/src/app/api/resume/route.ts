import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * GET /api/resume - Get all resumes for the logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(`${EXPRESS_API_URL}/api/resume`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ message: "Unexpected response from server" }, { status: 502 });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ [RESUME:PROXY] GET /api/resume error:", error.message);
    return NextResponse.json({ message: `Proxy error: ${error.message}` }, { status: 500 });
  }
}
