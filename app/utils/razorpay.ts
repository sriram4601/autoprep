// This file contains utility functions for interacting with the Razorpay API
// It provides functions to create orders, verify payments, and handle webhooks

import Razorpay from 'razorpay'; // Import the Razorpay SDK
import { SubscriptionPlan } from './subscriptionUtils'; // Import subscription plan types

// Define plan prices (in INR, paise)
export const PLAN_PRICES = {
  [SubscriptionPlan.FREE]: 0, // Free plan (₹0)
  [SubscriptionPlan.BASIC]: 99900, // ₹999 per month
  [SubscriptionPlan.PREMIUM]: 199900, // ₹1,999 per month
};

// Initialize Razorpay instance with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Interface for order creation parameters
interface CreateOrderParams {
  amount: number; // Amount in smallest currency unit (paise for INR)
  currency?: string; // Currency code (default: INR)
  receipt?: string; // Your internal order ID
  notes?: Record<string, string>; // Additional notes for the order
}

/**
 * Create a new Razorpay order
 * @param params - Order creation parameters
 * @returns The created order object
 */
export async function createOrder(params: CreateOrderParams) {
  try {
    // Set default currency if not provided
    const currency = params.currency || 'INR';
    
    // Create the order
    const order = await razorpay.orders.create({
      amount: params.amount,
      currency,
      receipt: params.receipt,
      notes: params.notes,
    });
    
    return order;
  } catch (error) {
    // Log any errors
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

/**
 * Verify a Razorpay payment signature
 * @param orderId - The Razorpay order ID
 * @param paymentId - The Razorpay payment ID
 * @param signature - The Razorpay signature
 * @returns Whether the signature is valid
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  try {
    // Get the secret key
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    
    // Create the expected signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    
    // Compare the signatures
    return expectedSignature === signature;
  } catch (error) {
    // Log any errors
    console.error('Error verifying payment signature:', error);
    return false;
  }
}

/**
 * Get payment details from Razorpay
 * @param paymentId - The Razorpay payment ID
 * @returns The payment details
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    // Get the payment details
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    // Log any errors
    console.error('Error fetching payment details:', error);
    throw error;
  }
}

/**
 * Generate a short receipt ID that's under 40 characters
 * @param userId - The user ID
 * @returns A short receipt ID
 */
function generateShortReceiptId(userId: string): string {
  // Take just the first 8 characters of the user ID
  const shortUserId = userId.substring(0, 8);
  
  // Use a shorter timestamp (last 6 digits)
  const timestamp = (Date.now() % 1000000).toString().padStart(6, '0');
  
  // Generate a random 4-character string for additional uniqueness
  const randomChars = Math.random().toString(36).substring(2, 6);
  
  // Combine them with a prefix
  return `sub_${shortUserId}_${timestamp}_${randomChars}`;
}

/**
 * Create a subscription order for a plan
 * @param userId - The user ID
 * @param plan - The subscription plan
 * @returns The created order object
 */
export async function createSubscriptionOrder(userId: string, plan: SubscriptionPlan) {
  // Get the plan price
  const amount = PLAN_PRICES[plan];
  
  // If it's the FREE plan, we don't need to create an order
  if (plan === SubscriptionPlan.FREE) {
    throw new Error('Cannot create a payment order for the free plan');
  }
  
  // If no price found for the plan, throw an error
  if (!amount) {
    throw new Error(`Invalid plan: ${plan}`);
  }
  
  // Create a short receipt ID (under 40 characters)
  const receiptId = generateShortReceiptId(userId);
  
  // Log the receipt ID length for debugging
  console.log(`Receipt ID: ${receiptId} (length: ${receiptId.length})`);
  
  // Create the order
  return createOrder({
    amount,
    receipt: receiptId,
    notes: {
      userId,
      plan,
      type: 'subscription',
    },
  });
}

// Export the Razorpay instance for direct access if needed
export default razorpay;
