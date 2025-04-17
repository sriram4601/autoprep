// This file contains utility functions for managing API usage limits
// It provides functions to check and update API usage based on subscription plans

import supabase from './supabase'; // Import the Supabase client
import { SubscriptionPlan } from './subscriptionUtils'; // Import subscription plan types

// Define API call limits for different subscription plans
export const API_LIMITS = {
  [SubscriptionPlan.FREE]: 5, // Free users get 5 API calls per day
  [SubscriptionPlan.BASIC]: 100, // Basic users get 100 API calls per day
  [SubscriptionPlan.PREMIUM]: Infinity, // Premium users get unlimited API calls
};

// Interface for API usage data
export interface ApiUsageData {
  userId: string; // User ID
  date: string; // Date in YYYY-MM-DD format
  count: number; // Number of API calls made on this date
  limit: number; // Daily limit based on subscription plan
  remaining: number; // Remaining API calls for the day
  percentage: number; // Percentage of limit used
}

/**
 * Get the current API usage for a user
 * @param userId - The user ID to check usage for
 * @returns The API usage data or null if not found
 */
export async function getApiUsage(userId: string): Promise<ApiUsageData | null> {
  try {
    // Get the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get the user's subscription plan
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .single();
    
    // Default to free plan if no subscription found
    const plan = subscriptionData?.plan || SubscriptionPlan.FREE;
    
    // Get the daily limit for this plan
    const limit = API_LIMITS[plan as SubscriptionPlan] || API_LIMITS[SubscriptionPlan.FREE];
    
    // Get the current usage count
    const { data: usageData } = await supabase
      .from('api_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .single();
    
    // Default to 0 if no usage found
    const count = usageData?.count || 0;
    
    // Calculate remaining calls and percentage used
    const remaining = Math.max(0, limit - count);
    const percentage = limit === Infinity ? 0 : Math.min(100, Math.round((count / limit) * 100));
    
    // Return the usage data
    return {
      userId,
      date: today,
      count,
      limit,
      remaining,
      percentage
    };
  } catch (error) {
    // Log any errors
    console.error('Error getting API usage:', error);
    return null;
  }
}

/**
 * Check if a user has exceeded their API limit
 * @param userId - The user ID to check
 * @returns Whether the user has exceeded their limit
 */
export async function hasExceededApiLimit(userId: string): Promise<boolean> {
  try {
    // Get the usage data
    const usage = await getApiUsage(userId);
    
    // If no usage data, assume they haven't exceeded the limit
    if (!usage) return false;
    
    // Check if they've exceeded their limit
    return usage.count >= usage.limit;
  } catch (error) {
    // Log any errors
    console.error('Error checking API limit:', error);
    
    // In case of error, assume they haven't exceeded the limit (fail open)
    return false;
  }
}

/**
 * Increment the API usage count for a user
 * @param userId - The user ID to increment usage for
 * @returns Whether the increment was successful
 */
export async function incrementApiUsage(userId: string): Promise<boolean> {
  try {
    // Get the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get the current usage count
    const { data: usageData } = await supabase
      .from('api_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .single();
    
    if (usageData) {
      // Update existing record
      const { error } = await supabase
        .from('api_usage')
        .update({ 
          count: usageData.count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('date', today);
      
      // Return whether the update was successful
      return !error;
    } else {
      // Create new record
      const { error } = await supabase
        .from('api_usage')
        .insert({ 
          user_id: userId, 
          date: today, 
          count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      // Return whether the insert was successful
      return !error;
    }
  } catch (error) {
    // Log any errors
    console.error('Error incrementing API usage:', error);
    return false;
  }
}

/**
 * Reset API usage for a user (for testing or admin purposes)
 * @param userId - The user ID to reset usage for
 * @returns Whether the reset was successful
 */
export async function resetApiUsage(userId: string): Promise<boolean> {
  try {
    // Get the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Delete the usage record for today
    const { error } = await supabase
      .from('api_usage')
      .delete()
      .eq('user_id', userId)
      .eq('date', today);
    
    // Return whether the delete was successful
    return !error;
  } catch (error) {
    // Log any errors
    console.error('Error resetting API usage:', error);
    return false;
  }
}
