// This file handles the verification of Razorpay payments
// It verifies payment signatures and updates user subscriptions

import { NextRequest, NextResponse } from 'next/server'; // Import Next.js server components
import { cookies } from 'next/headers'; // Import cookies for authentication
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Import Supabase client creator
import { verifyPaymentSignature, getPaymentDetails } from '@/app/utils/razorpay'; // Import Razorpay utilities
import { SubscriptionPlan, upgradeSubscription } from '@/app/utils/subscriptionUtils'; // Import subscription utilities

// POST handler for verifying payments
export async function POST(request: NextRequest) {
  try {
    // Log request received
    console.log('Payment verification request received');
    
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
      console.log('Payment verification body:', body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body', details: parseError instanceof Error ? parseError.message : String(parseError) }, 
        { status: 400 }
      );
    }
    
    // Get the payment details from the request body
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    
    // Validate the required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log('Missing payment details:', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
      return NextResponse.json(
        { 
          error: 'Missing payment details',
          required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'],
          received: Object.keys(body)
        }, 
        { status: 400 }
      );
    }
    
    // Check if Razorpay API keys are configured
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keySecret) {
      console.error('Razorpay API secret key not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured properly' }, 
        { status: 500 }
      );
    }
    
    // Verify the payment signature
    console.log('Verifying payment signature...');
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    
    // If the signature is invalid, return an error
    if (!isValid) {
      console.error('Invalid payment signature');
      return NextResponse.json(
        { error: 'Invalid payment signature' }, 
        { status: 400 }
      );
    }
    
    console.log('Payment signature verified successfully');
    
    // Get the payment details from Razorpay
    try {
      console.log('Fetching payment details from Razorpay...');
      const payment = await getPaymentDetails(razorpay_payment_id);
      console.log('Payment details:', payment);
      
      // Get the plan from the payment notes
      const plan = payment.notes?.plan;
      
      // If no plan found, return an error
      if (!plan) {
        console.error('No plan specified in payment notes');
        return NextResponse.json(
          { error: 'Invalid payment: no plan specified', payment: payment }, 
          { status: 400 }
        );
      }
      
      // Check if the plan is valid
      if (!Object.values(SubscriptionPlan).includes(plan as SubscriptionPlan)) {
        console.error('Invalid plan in payment notes:', plan);
        return NextResponse.json(
          { error: `Invalid subscription plan: ${plan}`, validPlans: Object.values(SubscriptionPlan) }, 
          { status: 400 }
        );
      }
      
      // Upgrade the user's subscription
      console.log('Upgrading subscription to plan:', plan);
      const success = await upgradeSubscription(userId, plan as SubscriptionPlan);
      
      // If the upgrade failed, return an error
      if (!success) {
        console.error('Failed to upgrade subscription');
        return NextResponse.json(
          { error: 'Failed to upgrade subscription' }, 
          { status: 500 }
        );
      }
      
      console.log('Subscription upgraded successfully');
      
      // Save the payment details to the database
      try {
        console.log('Saving payment details to database...');
        const { error: insertError } = await supabase
          .from('payment_history')
          .insert({
            user_id: userId,
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            amount: payment.amount,
            currency: payment.currency,
            plan: plan,
            status: payment.status,
            created_at: new Date().toISOString()
          });
          
        if (insertError) {
          // Log error but don't fail the request
          console.error('Error saving payment to history:', insertError);
        } else {
          console.log('Payment details saved successfully');
        }
      } catch (dbError) {
        // Log error but don't fail the request
        console.error('Database error when saving payment:', dbError);
      }
      
      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Payment verified and subscription upgraded',
        plan: plan
      });
    } catch (paymentError) {
      console.error('Error fetching payment details:', paymentError);
      return NextResponse.json(
        { error: 'Failed to fetch payment details', details: paymentError instanceof Error ? paymentError.message : String(paymentError) }, 
        { status: 500 }
      );
    }
  } catch (error) {
    // Log any errors
    console.error('Unhandled error in payment verification API:', error);
    
    // Return a server error
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}

// Add comments to explain how this works:
// 1. The client completes payment using Razorpay checkout
// 2. Razorpay returns payment details including order ID, payment ID, and signature
// 3. The client sends these details to this endpoint for verification
// 4. This endpoint verifies the payment signature to ensure it's valid
// 5. If valid, it upgrades the user's subscription and saves the payment details
// 6. It returns a success response to the client
