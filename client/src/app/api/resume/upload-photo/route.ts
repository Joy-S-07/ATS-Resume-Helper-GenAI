import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * POST /api/resume/upload-photo
 * Forwards the raw multipart image to Express, returns { photoUrl: "data:..." }
 */
export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const contentType = request.headers.get("content-type") || "";
    const body = await request.arrayBuffer();

    const response = await fetch(`${EXPRESS_API_URL}/api/resume/upload-photo`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Cookie: cookieHeader,
      },
      body: Buffer.from(body),
    });

    const text = await response.text();
    let data: any;
    try { data = JSON.parse(text); } catch {
      return NextResponse.json({ message: "Unexpected response from server" }, { status: 502 });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ [RESUME:PROXY] upload-photo error:", error.message);
    return NextResponse.json({ message: `Proxy error: ${error.message}` }, { status: 500 });
  }
}
