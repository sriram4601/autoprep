// This file handles the creation of Razorpay orders
// It creates a new order for subscription payments

import { NextRequest, NextResponse } from 'next/server'; // Import Next.js server components
import { cookies } from 'next/headers'; // Import cookies for authentication
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Import Supabase client creator
import { createSubscriptionOrder } from '@/app/utils/razorpay'; // Import Razorpay utilities
import { SubscriptionPlan } from '@/app/utils/subscriptionUtils'; // Import subscription plan types

// POST handler for creating a new order
export async function POST(request: NextRequest) {
  try {
    // Log request received
    console.log('Create order request received');
    
    // Get the cookie store
    const cookieStore = cookies();
    
    // Create a Supabase client with the cookie store
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // If there was an error getting the session
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error', details: sessionError.message }, 
        { status: 500 }
      );
    }
    
    // If no session, user is not authenticated
    if (!session) {
      console.log('No session found, authentication required');
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    
    // Get the user ID from the session
    const userId = session.user.id;
    console.log('User ID:', userId);
    
    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body', details: parseError instanceof Error ? parseError.message : String(parseError) }, 
        { status: 400 }
      );
    }
    
    // Get the plan from the request body
    const { plan } = body;
    
    // Validate the plan
    if (!plan) {
      console.log('No plan specified in request');
      return NextResponse.json(
        { error: 'Subscription plan is required' }, 
        { status: 400 }
      );
    }
    
    // Check if the plan is valid
    if (!Object.values(SubscriptionPlan).includes(plan)) {
      console.log('Invalid plan specified:', plan);
      return NextResponse.json(
        { error: `Invalid subscription plan: ${plan}`, validPlans: Object.values(SubscriptionPlan) }, 
        { status: 400 }
      );
    }
    
    // Log the plan
    console.log('Creating order for plan:', plan);
    
    // Check if Razorpay API keys are configured
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    
    if (!keyId || !keySecret) {
      console.error('Razorpay API keys not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured properly' }, 
        { status: 500 }
      );
    }
    
    if (keyId !== publicKeyId) {
      console.warn('RAZORPAY_KEY_ID and NEXT_PUBLIC_RAZORPAY_KEY_ID do not match');
    }
    
    // Create a subscription order
    try {
      const order = await createSubscriptionOrder(userId, plan as SubscriptionPlan);
      console.log('Order created successfully:', order.id);
      
      // Return the order details
      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      });
    } catch (orderError) {
      console.error('Error creating subscription order:', orderError);
      
      // Handle specific error for free plan
      if (orderError instanceof Error && orderError.message.includes('free plan')) {
        return NextResponse.json(
          { error: 'Cannot create payment for free plan' }, 
          { status: 400 }
        );
      }
      
      // Return a server error
      return NextResponse.json(
        { error: 'Failed to create order', details: orderError instanceof Error ? orderError.message : String(orderError) }, 
        { status: 500 }
      );
    }
  } catch (error) {
    // Log any errors
    console.error('Unhandled error in create-order API:', error);
    
    // Return a server error
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}

// Add comments to explain how this works:
// 1. The user selects a subscription plan and initiates payment
// 2. This endpoint creates a new Razorpay order for the selected plan
// 3. The order details are returned to the client for payment processing
// 4. The client uses the Razorpay checkout to complete the payment
