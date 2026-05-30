import { NextRequest, NextResponse } from "next/server";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const body = await req.json();
  const res = await fetch(`${API}/api/interview/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
