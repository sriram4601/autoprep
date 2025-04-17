// This file provides an API endpoint for AI chat functionality
// It uses the API wrapper to enforce usage limits based on subscription plans

import { NextRequest, NextResponse } from 'next/server'; // Import Next.js server components
import { withApiLimits } from '@/app/utils/apiWrapper'; // Import API wrapper for enforcing limits

/**
 * Handler for AI chat API requests
 * @param req - The request object
 * @param userId - The authenticated user's ID
 * @param supabase - The Supabase client
 * @returns A response with the AI chat result
 */
async function aiChatHandler(req: NextRequest, userId: string, supabase: any) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    
    // Get the message from the request body
    const { message } = body;
    
    // Validate the message
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
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
    
    // Log the request for debugging
    console.log(`Processing AI chat request for user ${userId} with plan ${plan}`);
    
    // Here you would integrate with your actual AI service
    // This is a placeholder implementation
    const aiResponse = await processWithAI(message, plan);
    
    // Save the chat message and response to the database
    await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        message: message,
        response: aiResponse,
        created_at: new Date().toISOString()
      });
    
    // Return the AI response
    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Log any errors
    console.error('Error in AI chat endpoint:', error);
    
    // Return a server error
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

/**
 * Process a message with AI
 * This is a placeholder implementation - replace with your actual AI service
 * @param message - The message to process
 * @param plan - The user's subscription plan
 * @returns The AI response
 */
async function processWithAI(message: string, plan: string): Promise<string> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Different responses based on plan
  if (plan === 'premium') {
    // Premium users get more detailed responses
    return `Premium AI response to: "${message}"\n\nThis is a detailed response with advanced features available only to premium users. It includes more context, better formatting, and more accurate information.`;
  } else if (plan === 'basic') {
    // Basic users get standard responses
    return `Standard AI response to: "${message}"\n\nThis is a standard response with basic features.`;
  } else {
    // Free users get limited responses
    return `Basic AI response to: "${message}"\n\nThis is a limited response. Upgrade for more detailed answers.`;
  }
}

// Export the wrapped handler to enforce API limits
export const POST = withApiLimits(aiChatHandler);

// Add comments to explain how this works:
// 1. The withApiLimits wrapper checks if the user is authenticated
// 2. It then checks if the user has exceeded their API limit for the day
// 3. If they have, it returns a 429 Too Many Requests response
// 4. If not, it increments their usage count and calls the handler
// 5. The handler processes the request and returns the response
