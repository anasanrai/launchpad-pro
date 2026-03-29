import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Paddle?: any;
  }
}

interface PaddleCheckoutProps {
  tier: "starter" | "pro" | "agency";
  priceId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  isLoading?: boolean;
}

/**
 * Paddle Checkout Component
 * Initializes Paddle.js and opens checkout modal
 */
export function PaddleCheckout({
  tier,
  priceId,
  onSuccess,
  onError,
  isLoading = false,
}: PaddleCheckoutProps) {
  const paddleInitialized = useRef(false);

  useEffect(() => {
    // Load Paddle script
    if (!window.Paddle && !paddleInitialized.current) {
      paddleInitialized.current = true;

      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      script.onload = () => {
        // Initialize Paddle
        if (window.Paddle) {
          // Get the environment from env vars
          const environment = process.env.VITE_PADDLE_ENVIRONMENT || "sandbox";
          window.Paddle.Setup({
            token: process.env.VITE_PADDLE_CLIENT_TOKEN || "",
            environment,
          });
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  const handleCheckout = async () => {
    if (!window.Paddle) {
      toast.error("Paddle is not loaded. Please try again.");
      return;
    }

    try {
      // Open Paddle checkout
      window.Paddle.Checkout.open({
        items: [
          {
            priceId,
            quantity: 1,
          },
        ],
        customer: {
          // Email will be populated from auth context if available
          email: "",
        },
        settings: {
          displayMode: "inline",
          theme: "dark",
          locale: "en",
        },
        onCheckoutClose: () => {
          console.log("[Paddle] Checkout closed");
        },
        onCheckoutComplete: (data: any) => {
          console.log("[Paddle] Checkout complete:", data);
          toast.success(`Successfully subscribed to ${tier} plan!`);
          onSuccess?.();
        },
      });
    } catch (error) {
      console.error("[Paddle Checkout] Error:", error);
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error("Failed to open checkout. Please try again.");
      onError?.(err);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Upgrade to ${tier.charAt(0).toUpperCase() + tier.slice(1)}`
      )}
    </Button>
  );
}

/**
 * Alternative: Direct Paddle Checkout Link
 * For simple use cases, can use direct URL instead of modal
 */
export function getPaddleCheckoutUrl(priceId: string): string {
  return `https://checkout.paddle.com/checkout/${priceId}`;
}
