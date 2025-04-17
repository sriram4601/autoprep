// This file contains utility functions for handling subscriptions
// It provides basic subscription plan management

// Import the Supabase client
import supabase from './supabase';

// Define subscription plan types
export enum SubscriptionPlan {
  FREE = 'free', // Free plan with limited features
  BASIC = 'basic', // Basic paid plan
  PREMIUM = 'premium' // Premium paid plan with all features
}

// Interface for subscription data
export interface SubscriptionData {
  plan: SubscriptionPlan; // Current subscription plan
  subscriptionStartDate?: Date; // When the paid subscription started
  subscriptionEndDate?: Date; // When the paid subscription will end
}

/**
 * Get the subscription data for a user
 * @param userId - The user ID to get subscription data for
 * @returns The subscription data or null if not found
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionData | null> {
  try {
    // Query the subscriptions table for the user's subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // If there was an error or no data, return null
    if (error || !data) {
      console.log('No subscription found for user:', userId);
      return null;
    }
    
    // Return the subscription data
    return {
      plan: data.plan,
      subscriptionStartDate: data.subscription_start_date ? new Date(data.subscription_start_date) : undefined,
      subscriptionEndDate: data.subscription_end_date ? new Date(data.subscription_end_date) : undefined
    };
  } catch (error) {
    // Log any unexpected errors
    console.error('Error in getUserSubscription:', error);
    return null;
  }
}

/**
 * Upgrade a user's subscription to a paid plan
 * @param userId - The user ID to upgrade
 * @param plan - The plan to upgrade to
 * @returns Whether the upgrade was successful
 */
export async function upgradeSubscription(userId: string, plan: SubscriptionPlan): Promise<boolean> {
  try {
    // Get the current date
    const now = new Date();
    
    // Check if the user already has a subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (existingSubscription) {
      // Update the existing subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan,
          subscription_start_date: now.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('user_id', userId);
      
      // If there was an error, log it and return false
      if (error) {
        console.error('Error upgrading subscription:', error);
        return false;
      }
    } else {
      // Create a new subscription
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan,
          subscription_start_date: now.toISOString(),
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        });
      
      // If there was an error, log it and return false
      if (error) {
        console.error('Error creating paid subscription:', error);
        return false;
      }
    }
    
    // If we got here, the upgrade was successful
    return true;
  } catch (error) {
    // Log any unexpected errors
    console.error('Error in upgradeSubscription:', error);
    return false;
  }
}
