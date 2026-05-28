import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * POST /api/ats
 * Proxies the multipart file upload to the Express backend.
 * Forwards the auth cookie so the backend can identify the user.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';

    // Forward the raw multipart body as-is — do NOT parse it here
    const contentType = request.headers.get('content-type') || '';
    const body = await request.arrayBuffer();

    const backendResponse = await fetch(`${BACKEND_URL}/api/ats/analyse`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Cookie: cookieHeader,
      },
      body: Buffer.from(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Analysis failed' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('ATS proxy error:', error);
    return NextResponse.json({ error: 'Failed to analyse resume' }, { status: 500 });
  }
}

/**
 * GET /api/ats
 * Fetches all saved ATS results for the logged-in user.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';

    const backendResponse = await fetch(`${BACKEND_URL}/api/ats`, {
      headers: { Cookie: cookieHeader },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch results' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('ATS fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch ATS results' }, { status: 500 });
  }
}
