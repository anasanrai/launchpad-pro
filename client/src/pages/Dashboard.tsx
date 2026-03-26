import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Target,
  Mail,
  BookOpen,
  Activity,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

// Sample data for charts
const revenueProjectionData = [
  { month: "Jan", value: 45000 },
  { month: "Feb", value: 52000 },
  { month: "Mar", value: 48000 },
  { month: "Apr", value: 61000 },
  { month: "May", value: 75000 },
  { month: "Jun", value: 89000 },
];

const performanceMetricsData = [
  { name: "Lead Conversion", value: 45 },
  { name: "Market Penetration", value: 67 },
  { name: "Customer Satisfaction", value: 92 },
  { name: "ROI Achievement", value: 78 },
];

const marketSaturationData = [
  { name: "SaaS", value: 45, fill: "#6366F1" },
  { name: "Consulting", value: 28, fill: "#06B6D4" },
  { name: "HealthTech", value: 20, fill: "#F59E0B" },
  { name: "MarTech", value: 15, fill: "#EF4444" },
  { name: "E-Learning", value: 32, fill: "#A855F7" },
  { name: "FinTech", value: 25, fill: "#EC4899" },
  { name: "PropTech", value: 18, fill: "#10B981" },
  { name: "EdTech", value: 12, fill: "#3B82F6" },
];

const conversionRateData = [
  { week: "W1", rate: 2.1 },
  { week: "W2", rate: 2.8 },
  { week: "W3", rate: 3.2 },
  { week: "W4", rate: 4.1 },
];

const recentActivityData = [
  {
    id: 1,
    title: "New market research completed",
    time: "2 minutes ago",
    color: "bg-emerald-500/20 text-emerald-400",
    icon: "●",
  },
  {
    id: 2,
    title: "ROI prediction updated",
    time: "15 minutes ago",
    color: "bg-blue-500/20 text-blue-400",
    icon: "●",
  },
  {
    id: 3,
    title: "147 new leads identified",
    time: "1 hour ago",
    color: "bg-emerald-500/20 text-emerald-400",
    icon: "●",
  },
  {
    id: 4,
    title: "Curriculum generated for 'Advanced B2B Sales'",
    time: "2 hours ago",
    color: "bg-purple-500/20 text-purple-400",
    icon: "●",
  },
  {
    id: 5,
    title: "Market saturation alert: SaaS sector",
    time: "3 hours ago",
    color: "bg-amber-500/20 text-amber-400",
    icon: "●",
  },
];

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const { data: assets } = trpc.assets.list.useQuery({ limit: 5 }, { enabled: isAuthenticated });
  const { data: subscription } = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
          <Zap className="w-16 h-16 text-indigo-400 mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Welcome to LaunchPad Pro</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sign in to access your Command Center and manage all your AI-generated business assets.
          </p>
          <Button onClick={() => (window.location.href = getLoginUrl())}>Sign In to Dashboard</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Command Center</h1>
            <p className="text-muted-foreground mt-1">Real-time analytics and market intelligence</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              View AI Insights
            </Button>
            <Button size="sm" className="glow-primary-sm">
              <Zap className="w-4 h-4 mr-2" />
              Calculate ROI
            </Button>
          </div>
        </div>

        {/* Top 4 Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Revenue Potential",
              value: "$2.4M",
              trend: "+23.5%",
              icon: "💰",
              color: "bg-indigo-500/20",
            },
            {
              label: "Market Score",
              value: "87/100",
              trend: "+5 pts",
              icon: "🎯",
              color: "bg-cyan-500/20",
            },
            {
              label: "Leads Found",
              value: "1,247",
              trend: "+12.3%",
              icon: "👥",
              color: "bg-purple-500/20",
            },
            {
              label: "Courses Outlined",
              value: "36",
              trend: "+8",
              icon: "📚",
              color: "bg-pink-500/20",
            },
          ].map((metric, i) => (
            <Card key={i} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center text-lg`}>
                    {metric.icon}
                  </div>
                  <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {metric.trend}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Projection */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Revenue Projection</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">6-month forecast analysis</p>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                  On Track
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenueProjectionData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D33" />
                  <XAxis dataKey="month" stroke="#6B6B75" />
                  <YAxis stroke="#6B6B75" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1E",
                      border: "1px solid #2D2D33",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#6366F1" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceMetricsData.map((metric, i) => {
                const colors = ["bg-blue-500", "bg-pink-500", "bg-emerald-500", "bg-amber-500"];
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{metric.name}</span>
                      <span className="text-sm font-medium text-foreground">{metric.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <div className={`h-full ${colors[i]} rounded-full`} style={{ width: `${metric.value}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Market Saturation Analysis */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Market Saturation Analysis</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Industry competition overview</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 h-56">
                {marketSaturationData.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg flex flex-col items-center justify-center text-white font-bold text-center p-2 relative overflow-hidden group hover:shadow-lg transition-shadow"
                    style={{
                      backgroundColor: item.fill,
                      gridColumn: item.value > 30 ? "span 2" : "span 1",
                      gridRow: item.value > 30 ? "span 2" : "span 1",
                      opacity: 0.9,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                    <div className="relative z-10">
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs opacity-90">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={conversionRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D33" />
                  <XAxis dataKey="week" stroke="#6B6B75" />
                  <YAxis stroke="#6B6B75" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1E",
                      border: "1px solid #2D2D33",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#06B6D4" strokeWidth={2} dot={{ fill: "#06B6D4", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivityData.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
