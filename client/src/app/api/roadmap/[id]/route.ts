import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * GET /api/roadmap/[id]
 * Fetch a single roadmap by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieHeader = request.headers.get('cookie') || '';

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/api/roadmap/${id}`, {
      headers: { Cookie: cookieHeader },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Not found' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ roadmap: data.roadmap });
  } catch (error) {
    console.error('Get roadmap error:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmap' }, { status: 500 });
  }
}

/**
 * PATCH /api/roadmap/[id]
 * Update task statuses in a roadmap.
 * Body: { tasks: Task[] }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieHeader = request.headers.get('cookie') || '';

  try {
    const body = await request.json();

    const backendResponse = await fetch(`${BACKEND_URL}/api/roadmap/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Update failed' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ roadmap: data.roadmap });
  } catch (error) {
    console.error('Update roadmap error:', error);
    return NextResponse.json({ error: 'Failed to update roadmap' }, { status: 500 });
  }
}

/**
 * DELETE /api/roadmap/[id]
 * Delete a roadmap.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieHeader = request.headers.get('cookie') || '';

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/api/roadmap/${id}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Delete failed' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ message: data.message });
  } catch (error) {
    console.error('Delete roadmap error:', error);
    return NextResponse.json({ error: 'Failed to delete roadmap' }, { status: 500 });
  }
}
