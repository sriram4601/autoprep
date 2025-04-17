import { NextRequest, NextResponse } from 'next/server';

// This API route handles resetting the student agent conversation
export async function POST(request: NextRequest) {
  try {
    // Send the reset request to the Flask backend server
    const response = await fetch('http://localhost:5000/api/student/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Backend server responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in student reset API:', error);
    return NextResponse.json(
      { error: 'Failed to reset conversation' },
      { status: 500 }
    );
  }
}
