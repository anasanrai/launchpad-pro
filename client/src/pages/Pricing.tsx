import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaddleCheckout } from "@/components/PaddleCheckout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import {
  CheckCircle2,
  CreditCard,
  Globe,
  Loader2,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const planColors: Record<string, { accent: string; bg: string; border: string; badge?: string }> = {
  starter: {
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  pro: {
    accent: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    badge: "Most Popular",
  },
  agency: {
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    badge: "Best Value",
  },
};

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const plansQuery = trpc.subscription.plans.useQuery();
  const subscriptionQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const activateMutation = trpc.subscription.activate.useMutation({
    onSuccess: () => {
      subscriptionQuery.refetch();
      toast.success("Plan activated!", {
        description: "Your subscription is now active.",
      });
    },
    onError: (err) => toast.error("Failed to activate plan", { description: err.message }),
  });

  const currentPlan = subscriptionQuery.data?.plan;
  const plans = plansQuery.data ?? [];

  const handleCheckoutSuccess = () => {
    subscriptionQuery.refetch();
    toast.success("Payment successful!", {
      description: "Your subscription has been activated.",
    });
  };

  const handleCheckoutError = (error: Error) => {
    toast.error("Payment failed", {
      description: error.message,
    });
  };

  const getPriceIdForPlan = (planId: string): string => {
    const priceMap: Record<string, string> = {
      starter: import.meta.env.VITE_PADDLE_PRICE_ID_STARTER || "",
      pro: import.meta.env.VITE_PADDLE_PRICE_ID_PRO || "",
      agency: import.meta.env.VITE_PADDLE_PRICE_ID_AGENCY || "",
    };
    return priceMap[planId] || "";
  };

  return (
    <AppLayout
      title="Pricing & Plans"
      subtitle="Choose the plan that fits your growth stage"
    >
      <div className="p-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Simple, <span className="text-gradient">transparent pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            All plans include access to our AI tools. Powered by Paddle for global payments
            with automatic tax handling for 180+ countries.
          </p>
          <div className="flex items-center justify-center gap-6 mt-5 text-xs text-muted-foreground">
            {[
              { icon: Globe, text: "180+ countries" },
              { icon: Shield, text: "Taxes handled" },
              { icon: CreditCard, text: "Cancel anytime" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-primary" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        {plansQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 shimmer rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const colors = planColors[plan.id] ?? planColors.starter;
              const isCurrent = currentPlan === plan.id;
              const isHighlighted = plan.highlighted;

              return (
                <Card
                  key={plan.id}
                  className={`bg-card relative overflow-hidden transition-all ${
                    isHighlighted
                      ? `border-2 ${colors.border} glow-primary`
                      : "border-border"
                  }`}
                >
                  {colors.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge className={`text-xs ${colors.bg} ${colors.accent} border-current/30`}>
                        <Star className="w-3 h-3 mr-1" />
                        {colors.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}
                    >
                      {plan.id === "starter" && <Zap className={`w-5 h-5 ${colors.accent}`} />}
                      {plan.id === "pro" && <Sparkles className={`w-5 h-5 ${colors.accent}`} />}
                      {plan.id === "agency" && <Rocket className={`w-5 h-5 ${colors.accent}`} />}
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {plan.name}
                    </CardTitle>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl font-extrabold text-foreground">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm">/{plan.interval}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className={`w-4 h-4 ${colors.accent} flex-shrink-0 mt-0.5`} />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {isCurrent ? (
                      <Button
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
                        Current Plan
                      </Button>
                    ) : !isAuthenticated ? (
                      <Button
                        className={`w-full ${isHighlighted ? "glow-primary-sm" : ""}`}
                        variant={isHighlighted ? "default" : "outline"}
                        onClick={() => window.location.href = getLoginUrl()}
                      >
                        Get Started
                      </Button>
                    ) : (
                      <PaddleCheckout
                        tier={plan.id as "starter" | "pro" | "agency"}
                        priceId={getPriceIdForPlan(plan.id)}
                        onSuccess={handleCheckoutSuccess}
                        onError={handleCheckoutError}
                        isLoading={activateMutation.isPending}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Paddle Notice */}
        <div className="mt-10 p-5 rounded-xl bg-card border border-border">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Built for Global Entrepreneurs
              </h3>
              <p className="text-sm text-muted-foreground">
                Payments are processed by{" "}
                <span className="text-primary font-medium">Paddle</span>, a Merchant of Record
                that handles all international taxes (VAT, GST, sales tax) automatically.
                No US entity required. Supports 180+ countries and 30+ currencies.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "BRL", "INR", "+22 more"].map(
                  (currency) => (
                    <Badge
                      key={currency}
                      variant="outline"
                      className="text-xs text-muted-foreground"
                    >
                      {currency}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes. Cancel your subscription at any time from your account settings. You'll retain access until the end of your billing period.",
            },
            {
              q: "Are taxes included?",
              a: "Paddle automatically calculates and remits taxes (VAT, GST, etc.) based on your location. The price shown is what you pay.",
            },
            {
              q: "What AI models are included?",
              a: "All plans include access to our AI engine. Pro and Agency plans unlock premium models including GPT-4, Claude 3.5, and Gemini Pro.",
            },
            {
              q: "Can I upgrade or downgrade?",
              a: "Yes. You can change your plan at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="p-4 rounded-xl bg-card border border-border">
              <h4 className="font-medium text-foreground text-sm mb-2">{q}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
