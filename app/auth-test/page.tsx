"use client";

import { useState } from 'react';
import supabase from '../utils/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session, User } from '@supabase/supabase-js';

export default function AuthTestPage() {
  // State to track authentication status
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState('');

  // Function to check current session
  const checkSession = async () => {
    // Set loading state to true
    setLoading(true);
    // Set message to indicate checking session
    setAuthMessage('Checking session...');
    
    try {
      // Get the current session from Supabase
      const { data, error } = await supabase.auth.getSession();
      
      // If there's an error, throw it
      if (error) {
        throw error;
      }
      
      // Update the session state
      setSession(data.session);
      // Update the user state
      setUser(data.session?.user || null);
      // Set message based on session status
      setAuthMessage(data.session ? 'Session found!' : 'No session found.');
    } catch (error) {
      // Log the error
      console.error('Error checking session:', error);
      // Set error message
      // Using type guard to safely access error.message property since error is of type 'unknown'
      setAuthMessage(`Error checking session: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  // Function to sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    // Set loading state to true
    setLoading(true);
    // Set message to indicate signing in
    setAuthMessage('Signing in...');
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // If there's an error, throw it
      if (error) {
        throw error;
      }
      
      // Update the session state
      setSession(data.session);
      // Update the user state
      setUser(data.user);
      // Set success message
      setAuthMessage('Successfully signed in!');
    } catch (error) {
      // Log the error
      console.error('Error signing in:', error);
      // Set error message
      // Using type guard to safely access error.message property since error is of type 'unknown'
      setAuthMessage(`Error signing in: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  // Function to sign out
  const signOut = async () => {
    // Set loading state to true
    setLoading(true);
    // Set message to indicate signing out
    setAuthMessage('Signing out...');
    
    try {
      // Sign out with Supabase
      const { error } = await supabase.auth.signOut();
      
      // If there's an error, throw it
      if (error) {
        throw error;
      }
      
      // Clear the session and user states
      setSession(null);
      setUser(null);
      // Set success message
      setAuthMessage('Successfully signed out!');
    } catch (error) {
      // Log the error
      console.error('Error signing out:', error);
      // Set error message
      // Using type guard to safely access error.message property since error is of type 'unknown'
      setAuthMessage(`Error signing out: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Auth Test Page</h1>
      
      {/* Status display */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
        <p className="mb-2"><strong>Status:</strong> {loading ? 'Loading...' : (user ? 'Authenticated' : 'Not authenticated')}</p>
        <p className="mb-2"><strong>Message:</strong> {authMessage}</p>
        {user && (
          <div className="mt-2">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
        <button 
          onClick={checkSession}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Session
        </button>
      </div>
      
      {/* Manual sign in form */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Manual Sign In</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          // Cast e.target to HTMLFormElement and use FormData to safely access form values
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const email = formData.get('email') as string;
          const password = formData.get('password') as string;
          signInWithEmail(email, password);
        }}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button 
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={loading}
          >
            Sign In
          </button>
        </form>
      </div>
      
      {/* Sign out button */}
      {user && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Sign Out</h2>
          <button 
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={loading}
          >
            Sign Out
          </button>
        </div>
      )}
      
      {/* Supabase Auth UI */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Supabase Auth UI</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
        />
      </div>
      
      {/* Debug information */}
      <div className="mt-8 p-4 border rounded bg-gray-100">
        <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
        <div className="overflow-auto max-h-60">
          <p className="mb-2"><strong>Session:</strong></p>
          <pre className="bg-gray-200 p-2 rounded text-xs">
            {session ? JSON.stringify(session, null, 2) : 'No session'}
          </pre>
          <p className="mt-4 mb-2"><strong>User:</strong></p>
          <pre className="bg-gray-200 p-2 rounded text-xs">
            {user ? JSON.stringify(user, null, 2) : 'No user'}
          </pre>
        </div>
      </div>
    </div>
  );
}
