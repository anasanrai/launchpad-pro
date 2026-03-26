import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  CheckCircle2,
  CreditCard,
  LogOut,
  Settings as SettingsIcon,
  Shield,
  User,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  const subscriptionQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const usageQuery = trpc.usage.stats.useQuery(undefined, { enabled: isAuthenticated });

  const subscription = subscriptionQuery.data;
  const usage = usageQuery.data;

  const planLabel = subscription?.plan
    ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)
    : "Free";

  if (loading) {
    return (
      <AppLayout title="Settings">
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 shimmer rounded-xl" />
          ))}
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppLayout title="Settings">
        <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
          <SettingsIcon className="w-16 h-16 text-primary mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Account Settings</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sign in to manage your account and subscription.
          </p>
          <Button onClick={() => (window.location.href = getLoginUrl())}>Sign In</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Settings" subtitle="Manage your account and subscription">
      <div className="p-6 max-w-3xl space-y-6">
        {/* Profile */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <div className="font-semibold text-foreground">{user?.name ?? "User"}</div>
                <div className="text-sm text-muted-foreground">{user?.email ?? "No email"}</div>
                <Badge variant="outline" className="text-xs mt-1 text-muted-foreground">
                  {user?.role === "admin" ? "Admin" : "Member"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">{planLabel} Plan</div>
                <div className="text-sm text-muted-foreground">
                  {subscription?.status === "active" ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Active subscription
                    </span>
                  ) : (
                    "No active subscription"
                  )}
                </div>
              </div>
              <Link href="/pricing">
                <Button size="sm" variant={subscription?.status === "active" ? "outline" : "default"}>
                  {subscription?.status === "active" ? "Manage Plan" : "Upgrade"}
                </Button>
              </Link>
            </div>

            {usage && (
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                {[
                  { label: "AI Calls", value: usage.totalCalls },
                  { label: "Tokens Used", value: `${(usage.totalTokens / 1000).toFixed(1)}K` },
                  { label: "Success Rate", value: `${usage.successRate}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="text-lg font-bold text-foreground">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Providers */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              AI Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              LaunchPad Pro uses a built-in AI engine with automatic provider selection.
              The system connects to OpenRouter, Gemini, OpenAI, and Anthropic with
              intelligent fallback routing.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "OpenRouter", status: "active", desc: "Multi-model gateway" },
                { name: "Google Gemini", status: "active", desc: "Gemini Pro / Flash" },
                { name: "OpenAI", status: "active", desc: "GPT-4o / GPT-4" },
                { name: "Anthropic", status: "active", desc: "Claude 3.5 Sonnet" },
              ].map(({ name, status, desc }) => (
                <div
                  key={name}
                  className="p-3 rounded-lg bg-input border border-border flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">{name}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs text-emerald-400 border-emerald-500/30"
                  >
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Authentication</div>
                <div className="text-xs text-muted-foreground">
                  Secured via Manus OAuth · Session-based authentication
                </div>
              </div>
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                Secure
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <div className="pt-2">
          <Button
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => {
              logout();
              toast.success("Signed out successfully");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
