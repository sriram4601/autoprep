import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Call the Python backend API for password reset
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to reset password' }, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in reset password API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
