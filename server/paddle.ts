import crypto from "crypto";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { subscriptions, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

/**
 * Paddle webhook event types we handle
 */
export type PaddleEventType =
  | "subscription.created"
  | "subscription.updated"
  | "subscription.activated"
  | "subscription.canceled"
  | "subscription.paused"
  | "subscription.resumed"
  | "transaction.completed"
  | "transaction.billed"
  | "transaction.payment_failed";

export interface PaddleWebhookPayload {
  event_id: string;
  event_type: PaddleEventType;
  occurred_at: string;
  data: Record<string, unknown>;
}

export interface PaddleSubscription {
  id: string;
  customer_id: string;
  product_id: string;
  price_id: string;
  status: "active" | "paused" | "canceled" | "past_due";
  current_billing_period: {
    starts_at: string;
    ends_at: string;
  };
  billing_cycle: {
    interval: string;
    frequency: number;
  };
  created_at: string;
  updated_at: string;
  next_billed_at?: string;
  custom_data?: {
    tier?: "starter" | "pro" | "agency";
  };
}

/**
 * Verify Paddle webhook signature
 * Paddle sends a signature header that we must verify
 */
export function verifyPaddleWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Paddle uses HMAC-SHA256 for signatures
    const hash = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    return hash === signature;
  } catch (error) {
    console.error("[Paddle] Signature verification error:", error);
    return false;
  }
}

/**
 * Get subscription tier from Paddle product ID
 */
function getTierFromProductId(productId: string): "starter" | "pro" | "agency" {
  const env = ENV;
  
  if (
    productId === env.paddleProductIdStarterSandbox ||
    productId === env.paddleProductIdStarterLive
  ) {
    return "starter";
  } else if (
    productId === env.paddleProductIdProSandbox ||
    productId === env.paddleProductIdProLive
  ) {
    return "pro";
  } else if (
    productId === env.paddleProductIdAgencySandbox ||
    productId === env.paddleProductIdAgencyLive
  ) {
    return "agency";
  }

  return "starter"; // Default fallback
}

/**
 * Handle subscription.created event
 */
export async function handleSubscriptionCreated(
  data: Record<string, unknown>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subscription = data as unknown as PaddleSubscription;
  const tier = getTierFromProductId(subscription.product_id);

  console.log(
    `[Paddle] New subscription created: ${subscription.id} (${tier})`
  );

  // Find user by Paddle customer ID (stored in custom_data or email)
  // For now, we'll need to match by email or store customer ID in users table
  // This is a simplified implementation - you may need to enhance this

  // Update or create subscription record
  // Note: userId is required but we'll need to link it from Paddle customer ID
  // For now, we store the Paddle IDs and handle user linking separately
  await db
    .insert(subscriptions)
    .values({
      userId: 0, // Placeholder - should be linked from Paddle customer ID
      paddleSubscriptionId: subscription.id,
      paddleCustomerId: subscription.customer_id,
      plan: tier,
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_billing_period.starts_at),
      currentPeriodEnd: new Date(subscription.current_billing_period.ends_at),
    })
    .onDuplicateKeyUpdate({
      set: {
        status: subscription.status as any,
        currentPeriodEnd: new Date(subscription.current_billing_period.ends_at),
        updatedAt: new Date(subscription.updated_at),
      },
    });
}

/**
 * Handle subscription.activated event
 */
export async function handleSubscriptionActivated(
  data: Record<string, unknown>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subscription = data as unknown as PaddleSubscription;
  const tier = getTierFromProductId(subscription.product_id);

  console.log(
    `[Paddle] Subscription activated: ${subscription.id} (${tier})`
  );

  await db
    .update(subscriptions)
    .set({
      status: "active",
      plan: tier,
      currentPeriodStart: new Date(subscription.current_billing_period.starts_at),
      currentPeriodEnd: new Date(subscription.current_billing_period.ends_at),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.paddleSubscriptionId, subscription.id));
}

/**
 * Handle subscription.updated event
 */
export async function handleSubscriptionUpdated(
  data: Record<string, unknown>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subscription = data as unknown as PaddleSubscription;
  const tier = getTierFromProductId(subscription.product_id);

  console.log(
    `[Paddle] Subscription updated: ${subscription.id} (${tier})`
  );

  await db
    .update(subscriptions)
    .set({
      status: subscription.status as any,
      plan: tier,
      currentPeriodEnd: new Date(subscription.current_billing_period.ends_at),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.paddleSubscriptionId, subscription.id));
}

/**
 * Handle subscription.canceled event
 */
export async function handleSubscriptionCanceled(
  data: Record<string, unknown>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const subscription = data as unknown as PaddleSubscription;

  console.log(`[Paddle] Subscription canceled: ${subscription.id}`);

  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.paddleSubscriptionId, subscription.id));
}

/**
 * Handle transaction.completed event
 */
export async function handleTransactionCompleted(
  data: Record<string, unknown>
): Promise<void> {
  const transaction = data as any;

  console.log(
    `[Paddle] Transaction completed: ${transaction.id} (${transaction.status})`
  );

  // Log transaction for analytics
  // Could also send confirmation email, update user credits, etc.
}

/**
 * Main webhook handler
 */
export async function handlePaddleWebhook(
  payload: PaddleWebhookPayload
): Promise<void> {
  const { event_type, data } = payload;

  try {
    switch (event_type) {
      case "subscription.created":
        await handleSubscriptionCreated(data);
        break;
      case "subscription.activated":
        await handleSubscriptionActivated(data);
        break;
      case "subscription.updated":
        await handleSubscriptionUpdated(data);
        break;
      case "subscription.canceled":
        await handleSubscriptionCanceled(data);
        break;
      case "transaction.completed":
        await handleTransactionCompleted(data);
        break;
      default:
        console.log(`[Paddle] Unhandled event type: ${event_type}`);
    }
  } catch (error) {
    console.error(`[Paddle] Error handling ${event_type}:`, error);
    throw error;
  }
}

/**
 * Get Paddle checkout URL for a subscription
 */
export function getPaddleCheckoutUrl(
  tier: "starter" | "pro" | "agency",
  environment: "sandbox" | "live" = "sandbox"
): string {
  const env = ENV;
  const priceId =
    environment === "sandbox"
      ? tier === "starter"
        ? env.paddlePriceIdStarterSandbox
        : tier === "pro"
          ? env.paddlePriceIdProSandbox
          : env.paddlePriceIdAgencySandbox
      : tier === "starter"
        ? env.paddlePriceIdStarterLive
        : tier === "pro"
          ? env.paddlePriceIdProLive
          : env.paddlePriceIdAgencyLive;

  // Paddle checkout URL format
  // This will be replaced with actual Paddle checkout integration
  return `https://checkout.paddle.com/checkout/${priceId}`;
}
