// This file handles the OAuth callback from Supabase
// It captures the session information after a successful OAuth login

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Import the Supabase route handler client
import { cookies } from 'next/headers'; // Import cookies from Next.js
import { NextRequest, NextResponse } from 'next/server'; // Import Next.js server components

// This route handles the callback from OAuth providers
export async function GET(request: NextRequest) {
  // Get the URL from the request
  const requestUrl = new URL(request.url);
  // Get the code from the URL query parameters
  const code = requestUrl.searchParams.get('code');

  // If there's a code parameter in the URL
  if (code) {
    // Create a Supabase client using the cookies
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the dashboard after handling the callback
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
