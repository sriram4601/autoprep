// This file provides an API endpoint to check a user's subscription status
// It returns information about their plan

import { NextResponse } from 'next/server'; // Import NextResponse for API responses
import { cookies } from 'next/headers'; // Import cookies for authentication
import supabase from '@/app/utils/supabase'; // Import Supabase client
import { 
  getUserSubscription,
  SubscriptionPlan
} from '@/app/utils/subscriptionUtils'; // Import subscription utilities

// GET handler for subscription status
export async function GET(request: Request) {
  try {
    // Get the session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('autoprep_session');
    
    // If no session cookie, user is not authenticated
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    
    // Parse the session
    const session = JSON.parse(sessionCookie.value);
    
    // If no user ID in session, session is invalid
    if (!session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Invalid session' }, 
        { status: 401 }
      );
    }
    
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Get the user's subscription
    const subscription = await getUserSubscription(userId);
    
    // If no subscription found, return default free plan
    if (!subscription) {
      return NextResponse.json({
        plan: SubscriptionPlan.FREE,
        subscriptionStartDate: null,
        subscriptionEndDate: null
      });
    }
    
    // Return the subscription data
    return NextResponse.json({
      plan: subscription.plan,
      subscriptionStartDate: subscription.subscriptionStartDate,
      subscriptionEndDate: subscription.subscriptionEndDate
    });
  } catch (error) {
    // Log any unexpected errors
    console.error('Error in subscription status endpoint:', error);
    
    // Return a server error
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

// POST handler for manually updating subscription status (admin only)
export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Extract the user ID and plan from the request body
    const { userId, plan, adminKey } = body;
    
    // Validate the admin key (this is a simple example, use a more secure method in production)
    const validAdminKey = process.env.ADMIN_API_KEY;
    if (!adminKey || adminKey !== validAdminKey) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 403 }
      );
    }
    
    // Validate the user ID
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      );
    }
    
    // Validate the plan
    if (!plan || !Object.values(SubscriptionPlan).includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' }, 
        { status: 400 }
      );
    }
    
    // Get the current date
    const now = new Date();
    
    // Check if the user already has a subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (existingSubscription) {
      // Update the existing subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan,
          subscription_start_date: now.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('user_id', userId);
      
      // If there was an error, return an error response
      if (error) {
        console.error('Error updating subscription:', error);
        return NextResponse.json(
          { error: 'Failed to update subscription' }, 
          { status: 500 }
        );
      }
    } else {
      // Create a new subscription
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan,
          subscription_start_date: now.toISOString(),
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        });
      
      // If there was an error, return an error response
      if (error) {
        console.error('Error creating subscription:', error);
        return NextResponse.json(
          { error: 'Failed to create subscription' }, 
          { status: 500 }
        );
      }
    }
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    // Log any unexpected errors
    console.error('Error in subscription update endpoint:', error);
    
    // Return a server error
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}
