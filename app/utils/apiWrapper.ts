// This file provides a wrapper for API endpoints to enforce usage limits
// It checks subscription plans and tracks API usage

import { NextRequest, NextResponse } from 'next/server'; // Import Next.js server components
import { cookies } from 'next/headers'; // Import cookies for authentication
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Import Supabase client creator
import { hasExceededApiLimit, incrementApiUsage } from './apiLimits'; // Import API limit utilities
import { SubscriptionPlan } from './subscriptionUtils'; // Import subscription plan types
import { Database } from '@/types/supabase'; // Import Database type for Supabase - Using @ alias to import from project root

// Type for the API handler function
type ApiHandler = (
  req: NextRequest, 
  userId: string, 
  supabase: ReturnType<typeof createRouteHandlerClient<Database>>
) => Promise<NextResponse>;

/**
 * Wrapper for API endpoints to enforce usage limits
 * @param handler - The API handler function to wrap
 * @returns A wrapped handler function that enforces API limits
 */
export function withApiLimits(handler: ApiHandler) {
  // Return a new handler function that wraps the original
  return async function(req: NextRequest): Promise<NextResponse> {
    try {
      // Get the cookie store
      const cookieStore = cookies();
      
      // Create a Supabase client with the cookie store
      const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session, user is not authenticated
      if (!session) {
        return NextResponse.json(
          { error: 'Authentication required' }, 
          { status: 401 }
        );
      }
      
      // Get the user ID from the session
      const userId = session.user.id;
      
      // Check if the user has exceeded their API limit
      const hasExceeded = await hasExceededApiLimit(userId);
      
      // If the user has exceeded their limit, return an error
      if (hasExceeded) {
        // Get the user's subscription plan
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('plan')
          .eq('user_id', userId)
          .single();
        
        // Default to free plan if no subscription found
        const plan = subscriptionData?.plan || SubscriptionPlan.FREE;
        
        // Return a 429 Too Many Requests response
        return NextResponse.json(
          {
            error: 'API call limit exceeded',
            message: 'You have reached your daily API call limit. Please upgrade your plan for more calls.',
            plan: plan
          },
          { status: 429 }
        );
      }
      
      // Increment the API usage count
      await incrementApiUsage(userId);
      
      // Call the original handler
      return await handler(req, userId, supabase);
    } catch (error) {
      // Log any errors
      console.error('Error in API wrapper:', error);
      
      // Return a server error
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  };
}

// Example usage:
/*
import { withApiLimits } from '@/app/utils/apiWrapper';

// Define your API handler
async function aiChatHandler(req: NextRequest, userId: string, supabase: any) {
  // Your API logic here
  const { message } = await req.json();
  
  // Process the message with your AI service
  const response = await processWithAI(message);
  
  // Return the response
  return NextResponse.json({ response });
}

// Export the wrapped handler
export const POST = withApiLimits(aiChatHandler);
*/
