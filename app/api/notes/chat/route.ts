// This file handles the notes chat API endpoint
// It processes user messages and tracks API usage based on subscription plans

import { NextRequest, NextResponse } from 'next/server'; // Import Next.js server components
import { withApiLimits } from '@/app/utils/apiWrapper'; // Import API wrapper for enforcing limits

/**
 * Handler for notes chat API requests
 * @param req - The request object
 * @param userId - The authenticated user's ID
 * @param supabase - The Supabase client
 * @returns A response with the chat result
 */
async function notesChatHandler(req: NextRequest, userId: string, supabase: any) {
  try {
    // Parse the request body
    const body = await req.json();
    const { message } = body;

    // Validate the message
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get the user's subscription plan
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .single();
    
    // Default to free plan if no subscription found
    const plan = subscriptionData?.plan || 'free';

    // Send the message to the backend server
    const response = await fetch('http://localhost:5000/api/notes/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        userId, // Pass the user ID to the backend
        plan     // Pass the subscription plan to the backend
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from server');
    }

    const data = await response.json();

    // Save the chat interaction to the database for history
    try {
      await supabase
        .from('chat_history')
        .insert({
          user_id: userId,
          message: message,
          response: data.response,
          created_at: new Date().toISOString()
        });
    } catch (dbError) {
      // Log but don't fail the request if saving to history fails
      console.error('Error saving chat to history:', dbError);
    }

    return NextResponse.json({ response: data.response });
  } catch (error) {
    // Log any errors
    console.error('Error in notes chat API:', error);
    
    // Return a server error
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Export the wrapped handler to enforce API limits
export const POST = withApiLimits(notesChatHandler);

// Add comments to explain how this works:
// 1. The withApiLimits wrapper checks if the user is authenticated
// 2. It then checks if the user has exceeded their API limit for the day
// 3. If they have, it returns a 429 Too Many Requests response
// 4. If not, it increments their usage count and calls the handler
// 5. The handler processes the request and returns the response
