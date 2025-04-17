// This file defines the TypeScript types for our Supabase database schema
// It helps provide type safety when interacting with the database

export type Database = {
  public: {
    // Define tables in the public schema
    Tables: {
      // Users table
      users: {
        Row: {
          id: string; // Primary key, UUID
          email: string; // User's email
          created_at: string; // Timestamp of creation
          updated_at: string; // Timestamp of last update
        };
        Insert: {
          id?: string; // Optional on insert
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Subscriptions table
      subscriptions: {
        Row: {
          id: string; // Primary key, UUID
          user_id: string; // Foreign key to users table
          plan: string; // Subscription plan (free, pro, enterprise)
          status: string; // Status of subscription (active, canceled, etc.)
          created_at: string; // Timestamp of creation
          updated_at: string; // Timestamp of last update
        };
        Insert: {
          id?: string; // Optional on insert
          user_id: string;
          plan: string;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      // API usage tracking table
      api_usage: {
        Row: {
          id: string; // Primary key, UUID
          user_id: string; // Foreign key to users table
          count: number; // Number of API calls
          date: string; // Date of usage
        };
        Insert: {
          id?: string; // Optional on insert
          user_id: string;
          count: number;
          date: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          count?: number;
          date?: string;
        };
      };
      // Add other tables as needed
    };
    // Define views in the public schema if any
    Views: {
      [_ in never]: never;
    };
    // Define functions in the public schema if any
    Functions: {
      [_ in never]: never;
    };
    // Define enums in the public schema if any
    Enums: {
      [_ in never]: never;
    };
  };
};

// Export additional types that might be useful
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
