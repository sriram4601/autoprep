'use client';

// This component handles the Razorpay checkout process
// It creates an order and opens the Razorpay payment modal

import { useState } from 'react'; // Import React hooks for state
import { useAuth } from '../contexts/AuthContext'; // Import auth context for user information
import { useRouter } from 'next/navigation'; // Import router for navigation
import { Button } from './ui/button'; // Import Button component
import { SubscriptionPlan } from '../utils/subscriptionUtils'; // Import subscription plan types

// Define props for the RazorpayCheckout component
interface RazorpayCheckoutProps {
  plan: SubscriptionPlan; // The subscription plan to purchase
  buttonText?: string; // Optional custom button text
  className?: string; // Optional CSS class for styling
}

// RazorpayCheckout component
export default function RazorpayCheckout({ 
  plan, 
  buttonText = 'Upgrade Now', 
  className = '' 
}: RazorpayCheckoutProps) {
  // Get user from auth context
  const { user } = useAuth();
  // Get router for navigation
  const router = useRouter();
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State for error message
  const [error, setError] = useState<string | null>(null);
  // State for debug information
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Function to handle payment
  const handlePayment = async () => {
    // Reset states
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      // If no user, redirect to login
      if (!user) {
        router.push('/login?redirect=/pricing');
        return;
      }
      
      // Log the request being made
      console.log('Creating order for plan:', plan);
      
      try {
        // Create an order
        const response = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan }),
        });
        
        // Debug: Log the raw response
        const responseText = await response.text();
        console.log('Raw API response:', responseText);
        
        // Try to parse the response as JSON
        let data;
        try {
          // Parse the response text as JSON
          data = JSON.parse(responseText);
        } catch (parseError) {
          // If parsing fails, set detailed error information
          console.error('JSON parse error:', parseError);
          setError('Server returned invalid JSON response');
          setDebugInfo(`Response status: ${response.status}, Content: ${responseText.substring(0, 100)}...`);
          setIsLoading(false);
          return;
        }
        
        // If the response was not successful, set error state
        if (!response.ok) {
          setError(data.error || `Failed to create order (Status: ${response.status})`);
          setIsLoading(false);
          return;
        }
        
        // Get the order details
        const { orderId, amount, currency, keyId } = data;
        
        // Debug: Log the order details
        console.log('Order created:', { orderId, amount, currency, keyId });
        
        // Check if we have all required fields
        if (!orderId || !amount || !currency || !keyId) {
          setError('Missing required order details from server');
          setDebugInfo(`Received: ${JSON.stringify(data)}`);
          setIsLoading(false);
          return;
        }
        
        // Load the Razorpay script if not already loaded
        if (!(window as any).Razorpay) {
          console.log('Loading Razorpay script...');
          await loadRazorpayScript();
          console.log('Razorpay script loaded');
        }
        
        // Create a new Razorpay instance
        const razorpayOptions = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: 'AutoPrep',
          description: `Subscription to ${plan} plan`,
          order_id: orderId,
          handler: async function(response: any) {
            // Log the payment response
            console.log('Payment successful, response:', response);
            // Handle the payment success
            await handlePaymentSuccess(response);
          },
          prefill: {
            name: user.user_metadata?.name || '',
            email: user.email || '',
          },
          theme: {
            color: '#3B82F6', // Blue color matching your UI
          },
          // Add error handlers for Razorpay
          modal: {
            ondismiss: function() {
              console.log('Checkout form closed');
              setIsLoading(false);
            }
          },
          notes: {
            plan: plan
          }
        };
        
        console.log('Initializing Razorpay with options:', razorpayOptions);
        
        // Create Razorpay instance
        const razorpay = new (window as any).Razorpay(razorpayOptions);
        
        // Open the Razorpay checkout modal
        razorpay.open();
      } catch (fetchError) {
        // Handle network errors specifically
        console.error('Network error:', fetchError);
        setError('Network error when connecting to payment server');
        setDebugInfo(fetchError instanceof Error ? fetchError.message : String(fetchError));
      }
    } catch (err) {
      // Set error state if an exception occurred
      console.error('Error in payment process:', err);
      setError('An error occurred while processing your payment');
      setDebugInfo(err instanceof Error ? err.message : String(err));
    } finally {
      // Only set loading to false if the Razorpay modal isn't open
      // (Razorpay's handler or ondismiss will set it otherwise)
      if (!(window as any).Razorpay) {
        setIsLoading(false);
      }
    }
  };
  
  // Function to load the Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        script.onerror = (error) => {
          console.error('Failed to load Razorpay script:', error);
          reject(new Error('Failed to load Razorpay script'));
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading Razorpay script:', error);
        reject(error);
      }
    });
  };
  
  // Function to handle payment success
  const handlePaymentSuccess = async (response: any) => {
    try {
      // Log the verification request
      console.log('Verifying payment:', response);
      
      // Verify the payment
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
      });
      
      // Get the raw response text
      const responseText = await verifyResponse.text();
      console.log('Raw verification response:', responseText);
      
      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error in verification:', parseError);
        setError('Server returned invalid JSON response during verification');
        setDebugInfo(`Response status: ${verifyResponse.status}, Content: ${responseText.substring(0, 100)}...`);
        return;
      }
      
      // If the response was not successful, set error state
      if (!verifyResponse.ok) {
        setError(data.error || `Failed to verify payment (Status: ${verifyResponse.status})`);
        return;
      }
      
      // Show success message and redirect to dashboard
      console.log('Payment verified successfully:', data);
      alert('Payment successful! Your subscription has been upgraded.');
      router.push('/dashboard');
    } catch (err) {
      // Set error state if an exception occurred
      console.error('Error verifying payment:', err);
      setError('An error occurred while verifying your payment');
      setDebugInfo(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render the checkout button
  return (
    <div>
      {/* Display error message if there is one */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Error: {error}</p>
          {debugInfo && (
            <div className="mt-2 text-xs overflow-auto max-h-24 bg-white p-2 rounded">
              <p className="font-mono">Debug info: {debugInfo}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Payment button */}
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className={className}
        variant="primary"
      >
        {isLoading ? 'Processing...' : buttonText}
      </Button>
    </div>
  );
}
