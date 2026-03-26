import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  BookOpen,
  Clock,
  FileText,
  Mail,
  Rocket,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

const typeConfig = {
  market_research: {
    label: "Market Research",
    icon: Search,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    href: "/market-research",
  },
  course: {
    label: "Course",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    href: "/course-architect",
  },
  email_campaign: {
    label: "Email Campaign",
    icon: Mail,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    href: "/cold-emailer",
  },
};

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();

  const statsQuery = trpc.assets.stats.useQuery(undefined, { enabled: isAuthenticated });
  const recentQuery = trpc.assets.list.useQuery(
    { limit: 6, offset: 0 },
    { enabled: isAuthenticated }
  );
  const usageQuery = trpc.usage.stats.useQuery(undefined, { enabled: isAuthenticated });
  const subscriptionQuery = trpc.subscription.get.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl shimmer" />
          ))}
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
          <Rocket className="w-16 h-16 text-primary mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Welcome to LaunchPad Pro</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sign in to access your AI-powered growth suite — market research, course creation,
            and cold outreach tools.
          </p>
          <Button size="lg" onClick={() => (window.location.href = getLoginUrl())}>
            <Sparkles className="w-5 h-5 mr-2" />
            Sign In to Get Started
          </Button>
        </div>
      </AppLayout>
    );
  }

  const stats = statsQuery.data;
  const recent = recentQuery.data ?? [];
  const usage = usageQuery.data;
  const subscription = subscriptionQuery.data;

  const planLabel = subscription?.plan
    ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)
    : "Free";

  const quickActions = [
    {
      title: "Market Research",
      description: "Analyze competitors and market opportunities",
      icon: Search,
      href: "/market-research",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      title: "Course Architect",
      description: "Build a structured 8-module course",
      icon: BookOpen,
      href: "/course-architect",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Cold Emailer",
      description: "Generate hyper-personalized outreach",
      icon: Mail,
      href: "/cold-emailer",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <AppLayout
      title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}!`}
      subtitle="Here's your growth suite overview"
    >
      <div className="p-6 space-y-8 max-w-7xl">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Assets",
              value: stats?.total ?? 0,
              icon: FileText,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Research Reports",
              value: stats?.market_research ?? 0,
              icon: Search,
              color: "text-violet-400",
              bg: "bg-violet-500/10",
            },
            {
              label: "Courses Built",
              value: stats?.course ?? 0,
              icon: BookOpen,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: "Email Campaigns",
              value: stats?.email_campaign ?? 0,
              icon: Mail,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {statsQuery.isLoading ? (
                    <div className="h-8 w-12 shimmer rounded" />
                  ) : (
                    stat.value
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions + Subscription */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <div
                    className={`p-5 rounded-xl bg-card border ${action.border} card-hover cursor-pointer h-full`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center mb-3`}
                    >
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                    <div className={`flex items-center gap-1 mt-3 text-xs ${action.color} font-medium`}>
                      Launch <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Subscription Card */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Your Plan
            </h2>
            <Card className="bg-card border-border h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-bold text-foreground">{planLabel}</div>
                    <div className="text-xs text-muted-foreground">
                      {subscription?.status === "active" ? (
                        <span className="flex items-center gap-1">
                          <span className="status-dot status-dot-active" />
                          Active
                        </span>
                      ) : (
                        "No active subscription"
                      )}
                    </div>
                  </div>
                  <Zap className="w-6 h-6 text-primary" />
                </div>

                {usage && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">AI Calls</span>
                      <span className="text-foreground font-medium">{usage.totalCalls}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Tokens Used</span>
                      <span className="text-foreground font-medium">
                        {(usage.totalTokens / 1000).toFixed(1)}K
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="text-emerald-400 font-medium">{usage.successRate}%</span>
                    </div>
                  </div>
                )}

                {planLabel === "Free" && (
                  <Link href="/pricing">
                    <Button size="sm" className="w-full">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Assets */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Assets
            </h2>
            <Link href="/assets">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>

          {recentQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl shimmer" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground text-sm">No assets yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start by running a Market Research or building a Course.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map((asset) => {
                const config = typeConfig[asset.type];
                return (
                  <Link key={asset.id} href={`/assets/${asset.id}`}>
                    <div className="p-4 rounded-xl bg-card border border-border card-hover cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          <config.icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground text-sm truncate">
                            {asset.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs px-1.5 py-0 ${config.color} border-current/30`}
                            >
                              {config.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
