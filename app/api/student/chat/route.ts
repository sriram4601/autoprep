import { NextRequest, NextResponse } from 'next/server';

// This API route handles chat messages sent to the student agent
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Send the message to the Flask backend server
    const response = await fetch('http://localhost:5000/student/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Backend server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error('Error in student chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
