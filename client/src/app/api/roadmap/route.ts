import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * POST /api/roadmap
 * Proxies the generate request to the Express backend.
 * Forwards the httpOnly auth cookie so the backend can identify the user.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;

    if (!role || !role.trim()) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // Forward the cookie header so the Express auth middleware can read it
    const cookieHeader = request.headers.get('cookie') || '';

    const backendResponse = await fetch(`${BACKEND_URL}/api/roadmap/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ role: role.trim() }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to generate roadmap' },
        { status: backendResponse.status }
      );
    }

    // Return tasks in the shape the frontend already expects
    return NextResponse.json({ tasks: data.roadmap.tasks, roadmapId: data.roadmap._id });
  } catch (error) {
    console.error('Roadmap proxy error:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
  }
}

/**
 * GET /api/roadmap
 * Fetches all saved roadmaps for the logged-in user.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';

    const backendResponse = await fetch(`${BACKEND_URL}/api/roadmap`, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
      },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch roadmaps' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ roadmaps: data.roadmaps });
  } catch (error) {
    console.error('Roadmap fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmaps' }, { status: 500 });
  }
}
