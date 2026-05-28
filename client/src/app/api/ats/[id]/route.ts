import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * GET /api/ats/[id]
 * Fetch a single ATS result by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieHeader = request.headers.get('cookie') || '';

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/api/ats/${id}`, {
      headers: { Cookie: cookieHeader },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Not found' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get ATS result error:', error);
    return NextResponse.json({ error: 'Failed to fetch ATS result' }, { status: 500 });
  }
}

/**
 * DELETE /api/ats/[id]
 * Delete an ATS result.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieHeader = request.headers.get('cookie') || '';

  try {
    const backendResponse = await fetch(`${BACKEND_URL}/api/ats/${id}`, {
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
    console.error('Delete ATS result error:', error);
    return NextResponse.json({ error: 'Failed to delete ATS result' }, { status: 500 });
  }
}
