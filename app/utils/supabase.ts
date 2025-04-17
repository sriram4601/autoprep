import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// This file creates a Supabase client for client-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create the Supabase client with cookie-based auth configuration
// Setting persistSession to true ensures that the session is stored in cookies
// Setting autoRefreshToken to true ensures that the token is refreshed automatically
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'sb-auth-token',
    storage: {
      getItem: (key) => {
        // For SSR, we need to check if window is defined
        if (typeof window === 'undefined') {
          return null;
        }
        // Get the item from localStorage as fallback
        return localStorage.getItem(key);
      },
      setItem: (key, value) => {
        // For SSR, we need to check if window is defined
        if (typeof window === 'undefined') {
          return;
        }
        // Set the item in localStorage as fallback
        localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        // For SSR, we need to check if window is defined
        if (typeof window === 'undefined') {
          return;
        }
        // Remove the item from localStorage as fallback
        localStorage.removeItem(key);
      },
    },
  },
});

export default supabase;
