import { NextRequest, NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const body = await req.json();

  const res = await fetch(`${API}/api/interview/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "TTS failed" }));
    return NextResponse.json(data, { status: res.status });
  }

  // Stream audio bytes back — do NOT set Content-Length
  const audioBuffer = await res.arrayBuffer();
  return new NextResponse(audioBuffer, {
    status: 200,
    headers: { "Content-Type": "audio/mpeg" },
  });
}
