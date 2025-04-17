// This file handles subscription upgrades
// It allows users to upgrade from a trial to a paid plan

import { NextResponse } from 'next/server'; // Import NextResponse for API responses
import { cookies } from 'next/headers'; // Import cookies for authentication
import supabase from '@/app/utils/supabase'; // Import Supabase client
import { 
  upgradeSubscription, 
  SubscriptionPlan 
} from '@/app/utils/subscriptionUtils'; // Import subscription utilities

// POST handler for upgrading subscriptions
export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Extract the plan from the request body
    const { plan } = body;
    
    // Validate the plan
    if (!plan || !Object.values(SubscriptionPlan).includes(plan)) {
      // Return error if plan is invalid
      return NextResponse.json(
        { error: 'Invalid subscription plan' }, 
        { status: 400 }
      );
    }
    
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
    
    // This is where you would integrate with a payment processor like Stripe
    // For now, we'll just update the subscription in the database
    
    // In a real implementation, you would:
    // 1. Create a checkout session with Stripe
    // 2. Return the checkout URL to redirect the user
    // 3. Handle the webhook from Stripe after payment
    // 4. Update the subscription in the database
    
    // For this example, we'll just update the subscription directly
    const success = await upgradeSubscription(userId, plan);
    
    // If the upgrade failed, return error
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to upgrade subscription' }, 
        { status: 500 }
      );
    }
    
    // Return success
    return NextResponse.json({
      success: true,
      message: 'Subscription upgraded successfully',
      plan
    });
  } catch (error) {
    // Log and return any errors
    console.error('Error upgrading subscription:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade subscription' }, 
      { status: 500 }
    );
  }
}

// GET handler to get available plans
export async function GET() {
  try {
    // Return the available plans
    return NextResponse.json({
      plans: [
        {
          id: SubscriptionPlan.FREE,
          name: 'Free',
          description: 'Basic access with limited features',
          price: 0,
          features: [
            'Limited access to AI tools',
            'Basic note-taking',
            'Community support'
          ]
        },
        {
          id: SubscriptionPlan.BASIC,
          name: 'Basic',
          description: 'Standard access with core features',
          price: 9.99,
          features: [
            'Full access to Student AI',
            'Basic note generation',
            'Email support',
            '5 AI sessions per day'
          ]
        },
        {
          id: SubscriptionPlan.PREMIUM,
          name: 'Premium',
          description: 'Full access to all features',
          price: 19.99,
          features: [
            'Unlimited AI sessions',
            'Advanced note generation',
            'Priority support',
            'Custom AI training',
            'Offline access'
          ]
        }
      ]
    });
  } catch (error) {
    // Log and return any errors
    console.error('Error getting subscription plans:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription plans' }, 
      { status: 500 }
    );
  }
}
