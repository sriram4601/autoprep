import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Import cookies from Next.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Import Supabase route handler

export async function POST(request: Request) {
  try {
    // Parse the request body to get email, password, and captchaToken
    const { email, password, captchaToken } = await request.json(); // Added captchaToken to destructuring
    
    // Get the API URL from environment variables or use default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('API URL:', apiUrl); // Log the API URL to verify it's correct
    
    try {
      // Create a Supabase client for server-side operations with proper cookie handling
      // The cookies() function is synchronous but the error suggests we need to handle it properly
      // for Next.js Server Components
      const cookieStore = cookies(); // Get the cookie store - this is synchronous
      
      // Create the Supabase client with the cookie store
      const supabase = createRouteHandlerClient({ 
        cookies: () => cookieStore // This function should return the cookieStore synchronously
      });
      
      // First try to sign in directly with Supabase
      // This ensures cookies are set properly in the browser
      console.log('Attempting Supabase authentication...'); // Log authentication attempt
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: captchaToken // Pass the captchaToken to Supabase for verification
        }
      });
      
      // If Supabase authentication was successful, return the data
      if (supabaseData?.session) {
        console.log('Successfully authenticated with Supabase'); // Log success for debugging
        
        // Create a response with the session data
        const response = NextResponse.json({
          success: true,
          user: supabaseData.user,
          session: supabaseData.session
        });
        
        // Return the response with cookies (set automatically by Supabase client)
        return response;
      }
      
      // If Supabase auth failed, try with our Python backend
      console.log('Supabase auth failed, details:', {
        error: supabaseError,
        errorMessage: supabaseError?.message,
        errorCode: supabaseError?.code,
        status: supabaseError?.status
      }); // Log detailed error information
      
      // Call the Python backend API for login
      console.log('Attempting to connect to Python backend at:', `${apiUrl}/api/auth/login`); // Log connection attempt
      try {
        const response = await fetch(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Fixed syntax error by removing extra '{'
          },
          body: JSON.stringify({ email, password, captchaToken }), // Added captchaToken to the request body
          // Add credentials to include cookies in the request
          credentials: 'include',
        });
        
        console.log('Python backend response status:', response.status); // Log response status
        
        const data = await response.json();
        console.log('Python backend response data:', data); // Log response data
        
        if (!response.ok) {
          return NextResponse.json({ error: data.error || 'Failed to log in' }, { status: response.status });
        }
        
        // If login was successful with the Python backend and we have session data
        if (data.success && data.session) {
          // Set the session in Supabase client which will handle the cookies
          const { error } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });
          
          if (error) {
            console.error('Error setting Supabase session:', error); // Log error for debugging
          } else {
            console.log('Successfully set Supabase session from Python backend'); // Log success for debugging
          }
        }
        
        // Create a response with the data
        const nextResponse = NextResponse.json(data);
        
        // Return the response with cookies
        return nextResponse;
      } catch (fetchError) {
        console.error('Error connecting to backend server:', fetchError); // Log error for debugging
        return NextResponse.json({ 
          error: 'Unable to connect to authentication server. Please make sure the server is running.',
          details: fetchError instanceof Error ? fetchError.message : String(fetchError)
        }, { status: 503 });
      }
    } catch (error) {
      console.error('Error in login API route:', error); // Log error for debugging
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in login API route:', error); // Log error for debugging
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
