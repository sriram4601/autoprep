import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling API responses
import supabase from '@/app/utils/supabase'; // Import the Supabase client
import { SubscriptionPlan} from '@/app/utils/subscriptionUtils'; // Import subscription utilities

export async function POST(request: Request) { // Define a POST handler function for the signup endpoint
  try { // Begin try block to handle any errors that might occur during the signup process
    const { email, password, metadata } = await request.json(); // Extract email, password, and metadata from the request body
    
    // Get the API URL from environment variables or use default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; // Set API URL from environment variables or use localhost:5000 as fallback
    
    try { // Begin nested try block to handle fetch-specific errors
      // Call the Python backend API for signup
      const response = await fetch(`${apiUrl}/api/auth/signup`, { // Make a POST request to the Python backend signup endpoint
        method: 'POST', // Set the HTTP method to POST
        headers: { // Set the request headers
          'Content-Type': 'application/json', // Specify that we're sending JSON data
        },
        body: JSON.stringify({ email, password, metadata }), // Convert the user data to JSON string and send it in the request body
      });
      
      const data = await response.json(); // Parse the JSON response from the backend
      
      if (!response.ok) { // Check if the response status is not in the 200-299 range (not successful)
        return NextResponse.json({ error: data.error || 'Failed to sign up' }, { status: response.status }); // Return error response with the backend error message or a default message
      }
      
      // If signup was successful, create a default subscription record for the user
      if (data.user && data.user.id) {
        // Create a subscription record with the free plan
        try {
          // Insert a new subscription record for the user with the free plan
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: data.user.id,
              plan: SubscriptionPlan.FREE, // Set to free plan by default
              subscription_start_date: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (subscriptionError) {
            // Log error but continue since user was created successfully
            console.error('Failed to create subscription record for user:', data.user.id, subscriptionError);
          }
        } catch (subscriptionError) {
          // Log error but continue since user was created successfully
          console.error('Error creating subscription record:', subscriptionError);
        }
      }
      
      return NextResponse.json(data); // Return the successful response data to the client
    } catch (fetchError) { // Catch any errors that occur during the fetch operation
      console.error('Error connecting to backend server:', fetchError); // Log the fetch error to the console
      return NextResponse.json({ // Return a detailed error response
        error: 'Unable to connect to authentication server. Please make sure the server is running.', // User-friendly error message
        details: fetchError instanceof Error ? fetchError.message : String(fetchError) // Include technical details of the error
      }, { status: 503 }); // Set HTTP status to 503 Service Unavailable
    }
  } catch (error) { // Catch any other errors in the API route
    console.error('Error in signup API route:', error); // Log the error to the console
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); // Return a generic error response with 500 status code
  }
}
