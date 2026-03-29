import { Router, Request, Response } from "express";
import {
  verifyPaddleWebhookSignature,
  handlePaddleWebhook,
  PaddleWebhookPayload,
} from "../paddle";
import { ENV } from "../_core/env";

const router = Router();

/**
 * Paddle Webhook Endpoint
 * POST /api/paddle/webhook
 *
 * Receives events from Paddle and processes subscription changes
 */
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    // Get the raw body for signature verification
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    const signature = req.headers["paddle-signature"] as string;

    if (!signature) {
      console.error("[Paddle Webhook] Missing signature header");
      return res.status(401).json({ error: "Missing signature" });
    }

    // Determine which secret to use (sandbox or live)
    const secret = ENV.paddleEnvironment === "sandbox"
      ? ENV.paddleWebhookSecretSandbox
      : ENV.paddleWebhookSecretLive;

    if (!secret) {
      console.error("[Paddle Webhook] Webhook secret not configured");
      return res.status(500).json({ error: "Webhook not configured" });
    }

    // Verify the signature
    const isValid = verifyPaddleWebhookSignature(rawBody, signature, secret);

    if (!isValid) {
      console.error("[Paddle Webhook] Invalid signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Parse the payload
    const payload = JSON.parse(rawBody) as PaddleWebhookPayload;

    console.log(`[Paddle Webhook] Received event: ${payload.event_type}`);

    // Handle the webhook event
    await handlePaddleWebhook(payload);

    // Return success
    res.status(200).json({ success: true, event_id: payload.event_id });
  } catch (error) {
    console.error("[Paddle Webhook] Error processing webhook:", error);
    // Still return 200 to prevent Paddle from retrying
    res.status(200).json({ success: false, error: String(error) });
  }
});

export default router;
