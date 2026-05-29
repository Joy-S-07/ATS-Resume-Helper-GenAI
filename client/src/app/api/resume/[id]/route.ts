import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * GET /api/resume/:id - Get a single resume by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const { id } = params;

    const response = await fetch(`${EXPRESS_API_URL}/api/resume/${id}`, {
      method: "GET",
      headers: { Cookie: cookieHeader },
    });

    const text = await response.text();
    let data: any;
    try { data = JSON.parse(text); } catch {
      return NextResponse.json({ message: "Unexpected response from server" }, { status: 502 });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ [RESUME:PROXY] GET /api/resume/:id error:", error.message);
    return NextResponse.json({ message: `Proxy error: ${error.message}` }, { status: 500 });
  }
}

/**
 * PATCH /api/resume/:id - Update a resume
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const { id } = params;
    const body = await request.json();

    const response = await fetch(`${EXPRESS_API_URL}/api/resume/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data: any;
    try { data = JSON.parse(text); } catch {
      return NextResponse.json({ message: "Unexpected response from server" }, { status: 502 });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ [RESUME:PROXY] PATCH /api/resume/:id error:", error.message);
    return NextResponse.json({ message: `Proxy error: ${error.message}` }, { status: 500 });
  }
}

/**
 * DELETE /api/resume/:id - Delete a resume
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const { id } = params;

    const response = await fetch(`${EXPRESS_API_URL}/api/resume/${id}`, {
      method: "DELETE",
      headers: { Cookie: cookieHeader },
    });

    const text = await response.text();
    let data: any;
    try { data = JSON.parse(text); } catch {
      return NextResponse.json({ message: "Unexpected response from server" }, { status: 502 });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ [RESUME:PROXY] DELETE /api/resume/:id error:", error.message);
    return NextResponse.json({ message: `Proxy error: ${error.message}` }, { status: 500 });
  }
}
