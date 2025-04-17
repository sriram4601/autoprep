import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; 

export async function POST(request: Request) {
  try {
    // Create a Supabase client with proper cookie handling
    // Use cookies() directly as it's not a Promise in the latest Next.js
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Try to get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Create a response object
    let responseData = { success: true, message: 'Logged out successfully' };
    
    // Sign out from Supabase regardless of whether there's a session
    // This will clear any cookies that might exist
    await supabase.auth.signOut();
    
    // Only call the backend API if there was an active session
    if (session?.access_token) {
      try {
        // Call the Python backend API for logout
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        // Get the response data if available
        if (response.ok) {
          const data = await response.json();
          responseData = { ...responseData, ...data };
        }
      } catch (fetchError) {
        // Log the error but continue with the logout process
        console.error('Error calling backend logout API:', fetchError);
        // We still want to return success since we've cleared the Supabase session
      }
    }
    
    // Create a response with the data
    const nextResponse = NextResponse.json(responseData);
    
    // Return the response
    return nextResponse;
  } catch (error) {
    // Log the error
    console.error('Error in logout API route:', error);
    // Return an error response
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
