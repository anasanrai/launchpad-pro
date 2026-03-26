import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, AlertCircle, Zap, Download } from "lucide-react";
import { useState } from "react";

export default function ROIPredictor() {
  const { isAuthenticated } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState(0);

  // ROI Success Probability (Circular Gauge)
  const successProbability = 78;
  const confidenceLevel = "High";

  // Risk Assessment Data
  const riskAssessment = [
    { label: "Market Volatility", level: "Medium", color: "bg-amber-500/20 text-amber-400" },
    { label: "Customer Acquisition Cost", level: "Low", color: "bg-emerald-500/20 text-emerald-400" },
    { label: "Regulatory Compliance", level: "Medium", color: "bg-amber-500/20 text-amber-400" },
  ];

  // Growth Opportunities
  const growthOpportunities = [
    { label: "Market Growth Rate", value: "+34%", color: "bg-emerald-500/20 text-emerald-400" },
    { label: "Scalability Potential", value: "High", color: "bg-blue-500/20 text-blue-400" },
    { label: "Brand Recognition", value: "+75%", color: "bg-indigo-500/20 text-indigo-400" },
  ];

  // Revenue Projections
  const revenueScenarios = [
    { name: "Conservative", revenue: "$245K", trend: "+8%", color: "bg-blue-500/10 border-blue-500/30" },
    { name: "Moderate", revenue: "$580K", trend: "+16%", color: "bg-indigo-500/10 border-indigo-500/30" },
    { name: "Optimistic", revenue: "$1.4M", trend: "+28%", color: "bg-emerald-500/10 border-emerald-500/30" },
    { name: "Aggressive", revenue: "$3.8M", trend: "+45%", color: "bg-amber-500/10 border-amber-500/30" },
  ];

  // Investment Breakdown Data
  const investmentData = [
    { category: "Marketing & Advertising", value: 35000, percentage: 35 },
    { category: "Product Development", value: 30000, percentage: 30 },
    { category: "Sales & Operations", value: 20000, percentage: 20 },
    { category: "Infrastructure", value: 15000, percentage: 15 },
  ];

  // Key Business Metrics
  const businessMetrics = [
    { label: "Customer Acquisition Cost", value: 87, max: 100, color: "from-blue-500 to-cyan-500" },
    { label: "Monthly Recurring Revenue", value: 72, max: 100, color: "from-indigo-500 to-purple-500" },
    { label: "Net Promoter Score", value: 91, max: 100, color: "from-emerald-500 to-teal-500" },
    { label: "Market Share Potential", value: 58, max: 100, color: "from-amber-500 to-orange-500" },
  ];

  // Monthly Projection Chart Data
  const projectionData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 61000 },
    { month: "Apr", revenue: 73000 },
    { month: "May", revenue: 87000 },
    { month: "Jun", revenue: 105000 },
  ];

  // Recommended Actions
  const recommendedActions = [
    {
      title: "Accelerate Sales Hiring",
      description: "Hire 3 additional sales reps to capture market opportunity",
      priority: "High",
      icon: "🚀",
      color: "border-emerald-500/30 bg-emerald-500/5",
    },
    {
      title: "Expand Market Reach",
      description: "Enter 2 new geographic markets in Q3",
      priority: "Medium",
      icon: "🌍",
      color: "border-amber-500/30 bg-amber-500/5",
    },
    {
      title: "Optimize Pricing Strategy",
      description: "Implement value-based pricing to improve margins",
      priority: "High",
      icon: "💰",
      color: "border-indigo-500/30 bg-indigo-500/5",
    },
  ];

  return (
    <AppLayout title="ROI Predictor">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ROI Predictor</h1>
            <p className="text-muted-foreground mt-1">Advanced predictive analytics and AI-driven insights</p>
          </div>
          <Button size="sm" className="glow-primary-sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Success Probability Gauge */}
          <Card className="bg-card border-border lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Success Probability</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Circular Gauge Background */}
                <svg className="absolute w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#1A1A1E" strokeWidth="8" />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(successProbability / 100) * 565} 565`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Text */}
                <div className="text-center z-10">
                  <p className="text-4xl font-bold text-emerald-400">{successProbability}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Success Rate</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  {confidenceLevel} Confidence
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskAssessment.map((risk, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{risk.label}</span>
                  <Badge className={`${risk.color} border-0`}>{risk.level}</Badge>
                </div>
              ))}
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Overall Risk: Medium
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Growth Opportunities */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Growth Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {growthOpportunities.map((opp, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{opp.label}</span>
                  <Badge className={`${opp.color} border-0`}>{opp.value}</Badge>
                </div>
              ))}
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <Zap className="w-3 h-3 inline mr-1" />
                  High Growth Potential
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Projections */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="text-base">Revenue Projections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {revenueScenarios.map((scenario, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${scenario.color} ${
                    selectedScenario === i ? "ring-2 ring-indigo-500" : ""
                  }`}
                  onClick={() => setSelectedScenario(i)}
                >
                  <p className="text-xs text-muted-foreground mb-1">{scenario.name}</p>
                  <p className="text-2xl font-bold text-foreground">{scenario.revenue}</p>
                  <p className="text-xs text-emerald-400 mt-2">{scenario.trend}</p>
                </div>
              ))}
            </div>

            {/* Projection Chart */}
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1A1A1E", border: "1px solid #333" }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ fill: "#6366F1", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Investment Breakdown & Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Investment Breakdown */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Investment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investmentData.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{item.category}</span>
                      <span className="text-xs text-muted-foreground">${item.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground">Total Investment: $100,000</p>
              </div>
            </CardContent>
          </Card>

          {/* Key Business Metrics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Key Business Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessMetrics.map((metric, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{metric.label}</span>
                    <span className="text-sm font-semibold text-foreground">{metric.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${metric.color}`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedActions.map((action, i) => (
                <div key={i} className={`p-4 rounded-lg border ${action.color}`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{action.icon}</span>
                    <Badge
                      className={
                        action.priority === "High"
                          ? "bg-red-500/20 text-red-400 border-0"
                          : "bg-amber-500/20 text-amber-400 border-0"
                      }
                    >
                      {action.priority}
                    </Badge>
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
