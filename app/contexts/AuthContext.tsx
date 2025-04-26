// Directive to indicate this is a client-side component
"use client";

// Import React and necessary hooks
import React, { createContext, useContext, useEffect, useState } from 'react';
// Import the Next.js router for navigation
import { useRouter } from 'next/navigation';
// Import Supabase client
import supabase from '../utils/supabase'; // Import the Supabase client

// Define types for our auth context
// Define the User type with required properties
type User = {
  // User ID property
  id: string;
  // User email property - updated to be optional to match Supabase User type
  email?: string;
  // Optional user metadata property
  user_metadata?: any;
};

// Define the AuthContextType with all properties and methods
type AuthContextType = {
  // Current user or null if not logged in
  user: User | null;
  // Current session or null if not logged in
  session: any | null;
  // Loading state indicator
  isLoading: boolean;
  // Signup method signature
  signUp: (email: string, password: string, metadata?: any, captchaToken?: string) => Promise<any>;
  // Sign in method signature - ensure captchaToken is included as an optional parameter
  signIn: (email: string, password: string, captchaToken?: string) => Promise<any>;
  // Sign out method signature
  signOut: () => Promise<void>;
  // Reset password method signature
  resetPassword: (email: string) => Promise<any>;
  // Sign in with OAuth method signature
  signInWithOAuth: (provider: 'google') => Promise<any>;
};

// Create the auth context
// Create a React context for authentication with TypeScript type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
// Define the AuthProvider component that will wrap the application
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State for storing the current user
  const [user, setUser] = useState<User | null>(null);
  // State for storing the current session
  const [session, setSession] = useState<any | null>(null);
  // State for tracking loading status
  const [isLoading, setIsLoading] = useState(true);
  // Initialize the router instance
  const router = useRouter();

  // Check for existing session on mount
  // Effect hook that runs on component mount
  useEffect(() => {
    // Function to get the current session from Supabase
    async function getInitialSession() {
      // Begin try block to handle any errors
      try {
        // Get session data from Supabase
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        
        // If a session exists, set the user and session state
        if (supabaseSession) {
          setSession(supabaseSession);
          setUser(supabaseSession.user);
        }
      } 
      // Catch any errors that occur during session retrieval
      catch (error) {
        // Log the error to the console
        console.error('Error getting initial session:', error);
      } 
      // Execute regardless of success or failure
      finally {
        // Set loading state to false
        setIsLoading(false);
      }
    }

    // Call the function to get the initial session
    getInitialSession();
    
    // Set up an auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Update session and user when auth state changes
        setSession(newSession);
        setUser(newSession?.user || null);
        setIsLoading(false);
      }
    );
    
    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  // Sign up a new user
  // Function to sign up a new user
  const signUp = async (email: string, password: string, metadata?: any, captchaToken?: string) => {
    // Set loading state to true during signup process
    setIsLoading(true);
    // Begin try block to handle any errors
    try {
      // Call the API route for signup instead of direct Supabase authentication
      // This ensures proper handling of captcha verification and backend integration
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, metadata, captchaToken }),
        credentials: 'include', // Important for cookies to be included
      });
      
      // Parse the response data
      const data = await response.json();
      
      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }
      
      // If signup was successful and we have user data, update the state
      if (data.success && data.user) {
        // We don't set the user here as they need to confirm their email first
        console.log('Signup successful, please check your email for confirmation');
      }
      
      // Return the response data
      return data;
    } 
    // Catch any errors during the signup process
    catch (error) {
      // Log the error to the console
      console.error('Error signing up:', error);
      // Convert error to string to prevent "Objects are not valid as React child" error
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Return error information as a string
      return { success: false, error: errorMessage };
    } 
    // Execute regardless of success or failure
    finally {
      // Set loading state to false
      setIsLoading(false);
    }
  };

  // Sign in an existing user
  // Function to sign in an existing user
  const signIn = async (email: string, password: string, captchaToken?: string) => {
    // Set loading state to true during sign in process
    setIsLoading(true);
    // Begin try block to handle any errors
    try {
      // Call the API route instead of direct Supabase authentication
      // This ensures cookies are properly set by createRouteHandlerClient
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Explicitly include captchaToken in the request body to ensure TypeScript recognizes it as a parameter
        body: JSON.stringify({ email, password, captchaToken }),
        credentials: 'include', // Important for cookies to be included
      });
      
      // Parse the response data
      const data = await response.json();
      
      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error(data.error || 'Failed to log in');
      }
      
      // If login was successful, update the user and session state
      if (data.success) {
        setUser(data.user);
        setSession(data.session);
        console.log('Authentication successful, session set');
      }
      
      // Return the response data on success
      return data;
    } 
    // Catch any errors during the sign in process
    catch (error) {
      // Log the error to the console
      console.error('Error signing in:', error);
      // Convert error to string to prevent "Objects are not valid as React child" error
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Return error information as a string
      return { success: false, error: errorMessage };
    } 
    // Execute regardless of success or failure
    finally {
      // Set loading state to false
      setIsLoading(false);
    }
  };

  // Sign out the current user
  // Function to sign out the current user
  const signOut = async () => {
    // Set loading state to true during sign out process
    setIsLoading(true);
    // Begin try block to handle any errors
    try {
      // Call the API route instead of direct Supabase authentication
      // This ensures cookies are properly cleared by createRouteHandlerClient
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important for cookies to be included
      });
      
      // Parse the response data
      const data = await response.json();
      
      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error(data.error || 'Failed to log out');
      }
      
      // Clear user and session from state
      setUser(null);
      setSession(null);
      
      // Redirect to the login page
      router.push('/login');
    } 
    // Catch any errors during the sign out process
    catch (error) {
      // Log the error to the console
      console.error('Error signing out:', error);
    } 
    // Execute regardless of success or failure
    finally {
      // Set loading state to false
      setIsLoading(false);
    }
  };

  // Reset password
  // Function to reset a user's password
  const resetPassword = async (email: string) => {
    // Set loading state to true during password reset process
    setIsLoading(true);
    // Begin try block to handle any errors
    try {
      // Use Supabase to send a password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      // If there was an error during password reset
      if (error) {
        throw error;
      }
      
      // Return success
      return { success: true };
    } 
    // Catch any errors during the password reset process
    catch (error) {
      // Log the error to the console
      console.error('Error resetting password:', error);
      // Return error information
      return { success: false, error };
    } 
    // Execute regardless of success or failure
    finally {
      // Set loading state to false
      setIsLoading(false);
    }
  };

  // Add a new method to handle OAuth sign-in
  // Function to sign in with OAuth providers
  const signInWithOAuth = async (provider: 'google') => {
    // Set loading state to true during OAuth sign-in process
    setIsLoading(true);
    // Begin try block to handle any errors
    try {
      // Use Supabase's signInWithOAuth method
      const { data, error } = await supabase.auth.signInWithOAuth({
        // Specify the OAuth provider (e.g., 'google')
        provider,
        // Set options for the OAuth flow
        options: {
          // Redirect to the dashboard after successful authentication
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      // Check if there was an error during the OAuth process
      if (error) {
        // Throw the error to be caught by the catch block
        throw error;
      }
      
      // Return the data from the OAuth sign-in attempt
      return { success: true, data };
    } 
    // Catch any errors during the OAuth sign-in process
    catch (error) {
      // Log the error to the console
      console.error('Error signing in with OAuth:', error);
      // Set loading state to false since we're handling the error here
      setIsLoading(false);
      // Return an error object
      return { success: false, error };
    }
    // Note: We don't set isLoading to false in a finally block
    // because the page will redirect on success
  };

  // Create the context value object with all state and methods
  const value = {
    // Current user state
    user,
    // Current session state
    session,
    // Loading state
    isLoading,
    // Sign up method
    signUp,
    // Sign in method
    signIn,
    // Sign out method
    signOut,
    // Reset password method
    resetPassword,
    // Sign in with OAuth method
    signInWithOAuth,
  };

  // Return the AuthContext.Provider with the value and children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a hook to use the auth context
// Custom hook to use the auth context
export function useAuth() {
  // Get the auth context
  const context = useContext(AuthContext);
  // If no context is found, throw an error
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Return the context
  return context;
}
