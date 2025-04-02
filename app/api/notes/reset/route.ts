import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Send reset request to the backend server
    const response = await fetch('http://localhost:5000/notes/reset', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to reset conversation');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting notes conversation:', error);
    return NextResponse.json(
      { error: 'Failed to reset conversation' },
      { status: 500 }
    );
  }
}
