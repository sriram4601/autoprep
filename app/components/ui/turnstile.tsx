"use client";

import { forwardRef, useRef, useState, useImperativeHandle } from 'react';
import { Turnstile as TurnstileWidget } from "@marsidev/react-turnstile";

// Define the props interface for the Turnstile component
interface TurnstileProps {
  // Callback function when captcha is successfully verified
  onVerify?: (token: string) => void;
  // Callback function when captcha verification fails
  onError?: () => void;
  // Callback function when captcha token expires
  onExpire?: () => void;
  // Theme for the captcha widget (light or dark)
  theme?: 'light' | 'dark';
  // Size of the captcha widget (normal, compact, or invisible)
  size?: 'normal' | 'compact' | 'invisible';
  // Custom class name for the container
  className?: string;
  // Site key for Cloudflare Turnstile
  siteKey?: string;
}

// Define the ref interface for the Turnstile component
export interface TurnstileRef {
  // Method to reset the captcha widget
  reset: () => void;
  // Method to get the current token
  getToken: () => string | null;
}

// Create a forwardRef component for Turnstile to allow parent components to access its methods
const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  ({ 
    onVerify, 
    onError, 
    onExpire, 
    theme = 'light', 
    size = 'normal', 
    className = '',
    siteKey
  }, ref) => {
    // State to store the captcha token
    const [token, setToken] = useState<string | null>(null);
    // Reference to the Turnstile widget
    const widgetRef = useRef(null);

    // Handle successful verification
    const handleSuccess = (token: string) => {
      // Store the token in state
      setToken(token);
      // Call the onVerify callback if provided
      if (onVerify) onVerify(token);
      // Log the verification for debugging
      console.log("Captcha verified successfully");
    };

    // Handle verification error
    const handleError = () => {
      // Reset the token
      setToken(null);
      // Call the onError callback if provided
      if (onError) onError();
      // Log the error for debugging
      console.error("Captcha verification failed");
    };

    // Handle token expiration
    const handleExpire = () => {
      // Reset the token
      setToken(null);
      // Call the onExpire callback if provided
      if (onExpire) onExpire();
      // Log the expiration for debugging
      console.log("Captcha token expired");
    };

    // Expose methods to parent components via ref
    useImperativeHandle(ref, () => ({
      // Method to reset the captcha widget
      reset: () => {
        // Reset the token state
        setToken(null);
        // Reset the widget if it exists
        if (widgetRef.current) {
          // @ts-ignore - The reset method exists on the widget but TypeScript doesn't know about it
          widgetRef.current.reset();
        }
      },
      // Method to get the current token
      getToken: () => token
    }));

    // Use the environment variable for the site key, or fall back to the prop
    const actualSiteKey = siteKey || process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '';

    return (
      <div className={`turnstile-container ${className}`}>
        {/* Render the Turnstile widget */}
        <TurnstileWidget
          ref={widgetRef}
          siteKey={actualSiteKey}
          onSuccess={handleSuccess}
          onError={handleError}
          onExpire={handleExpire}
          options={{
            theme: theme,
            size: size
          }}
        />
      </div>
    );
  }
);

// Set display name for debugging
Turnstile.displayName = 'Turnstile';

export default Turnstile;
