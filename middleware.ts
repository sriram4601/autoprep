// This middleware checks user authentication and subscription status
// It restricts access to protected routes and limits API calls based on subscription plan

import { NextResponse } from 'next/server'; // Import NextResponse for handling responses
import type { NextRequest } from 'next/server'; // Import NextRequest type
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'; // Import Supabase middleware client
import { SubscriptionPlan } from './app/utils/subscriptionUtils'; // Import subscription plan types

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/notes',
  '/dashboard/chat',
  '/dashboard/settings',
  // Add any other protected routes here
];

// Define routes that require premium subscription
const premiumRoutes = [
  '/dashboard/advanced-features',
  '/dashboard/analytics',
  // Add any premium-only features here
];

// Define API routes that should be limited based on subscription
const limitedApiRoutes = [
  '/api/ai/chat',
  '/api/ai/generate',
  '/api/notes',
  // Add any API routes that should be limited here
];

// Define public routes that are always accessible
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/pricing',
  '/about',
  '/contact',
  '/forgot-password',
  '/reset-password',
  // Add any other public routes here
];

// Define API call limits for different subscription plans
const API_LIMITS = {
  [SubscriptionPlan.FREE]: 5, // Free users get 5 API calls per day
  [SubscriptionPlan.BASIC]: 100, // Basic users get 100 API calls per day
  [SubscriptionPlan.PREMIUM]: Infinity, // Premium users get unlimited API calls
};

// Middleware function that runs on every request
export async function middleware(request: NextRequest) {
  // Create a response object that we'll modify as needed
  const response = NextResponse.next();
  
  // Create a Supabase client for the middleware
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Get the pathname from the request URL
  const path = request.nextUrl.pathname;
  
  // Check if this is a public route - allow access without checks
  if (publicRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    // Add debug header for public routes
    response.headers.set('x-debug-route-type', 'public');
    return response;
  }
  
  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Add debug header for session status
  response.headers.set('x-debug-has-session', session ? 'true' : 'false');
  
  // If no session and trying to access a protected route, redirect to login
  if (!session && protectedRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    console.log('No session found, redirecting to login'); // Debug log
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If authenticated user is trying to access a premium route
  if (session && premiumRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    try {
      // Check the user's subscription status
      const userId = session.user.id;
      
      // Fetch subscription data from the database
      const { data: subscriptionData, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      // If there was an error or no subscription data found, assume free plan
      const userPlan = (subscriptionData?.plan as SubscriptionPlan) || SubscriptionPlan.FREE;
      
      // If not on premium plan, redirect to pricing page
      if (userPlan !== SubscriptionPlan.PREMIUM) {
        // Redirect to the pricing page with upgrade prompt
        return NextResponse.redirect(new URL('/pricing?upgrade=premium', request.url));
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      // In case of error, allow access (fail open for better user experience)
      return response;
    }
  }
  
  // Check API rate limits for API routes
  if (session && limitedApiRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    try {
      const userId = session.user.id;
      
      // Fetch subscription data from the database
      const { data: subscriptionData, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      // If there was an error or no subscription data found, assume free plan
      const userPlan = (subscriptionData?.plan as SubscriptionPlan) || SubscriptionPlan.FREE;
      
      // Get the daily API call limit for this user's plan
      const dailyLimit = API_LIMITS[userPlan] || API_LIMITS[SubscriptionPlan.FREE];
      
      // Get the current date in YYYY-MM-DD format for tracking daily usage
      const today = new Date().toISOString().split('T')[0];
      
      // Get current API usage count from the database
      const { data: usageData, error: usageError } = await supabase
        .from('api_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('date', today)
        .single();
      
      // Current count of API calls today (default to 0 if no record exists)
      const currentCount = usageData?.count || 0;
      
      // Add debug headers for API usage
      response.headers.set('x-api-limit', String(dailyLimit));
      response.headers.set('x-api-usage', String(currentCount));
      
      // If user has exceeded their daily limit
      if (currentCount >= dailyLimit) {
        // Return a 429 Too Many Requests response
        return new NextResponse(
          JSON.stringify({
            error: 'API call limit exceeded',
            limit: dailyLimit,
            usage: currentCount,
            plan: userPlan,
            message: 'You have reached your daily API call limit. Please upgrade your plan for more calls.'
          }),
          { 
            status: 429, 
            headers: { 
              'Content-Type': 'application/json',
              'x-api-limit-exceeded': 'true'
            } 
          }
        );
      }
      
      // If user has not exceeded their limit, increment the usage count
      if (usageData) {
        // Update existing record
        await supabase
          .from('api_usage')
          .update({ count: currentCount + 1 })
          .eq('user_id', userId)
          .eq('date', today);
      } else {
        // Create new record
        await supabase
          .from('api_usage')
          .insert({ 
            user_id: userId, 
            date: today, 
            count: 1 
          });
      }
    } catch (error) {
      console.error('Error checking API limits:', error);
      // In case of error, allow the request (fail open for better user experience)
    }
  }
  
  // Allow the request to proceed
  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  // Run on all paths except static files, api routes, and _next
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    // Include API routes in middleware processing
    '/api/:path*',
  ],
};
