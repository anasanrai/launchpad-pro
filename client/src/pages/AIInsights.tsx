import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Streamdown } from "streamdown";
import { Download, Share2, ChevronDown, Clock } from "lucide-react";
import { useState } from "react";

export default function AIInsights() {
  const { isAuthenticated } = useAuth();
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  // Sample market research data
  const marketResearch = {
    title: "B2B SaaS Market Analysis - Q2 2026",
    sections: [
      {
        title: "Executive Summary",
        content:
          "The B2B SaaS market continues to experience robust growth, with enterprise solutions leading adoption. Market size reached $180B in 2025, projected to hit $325B by 2027. Key drivers include digital transformation initiatives, remote work infrastructure, and AI integration.",
      },
      {
        title: "Market Opportunity",
        content:
          "Mid-market segment (100-1000 employees) presents the highest growth potential with 34% YoY expansion. Vertical SaaS solutions show 2.5x faster adoption rates compared to horizontal platforms. Geographic expansion into APAC markets offers 15% untapped potential.",
      },
      {
        title: "Competitive Landscape",
        content:
          "Top 5 players control 43% market share. Average customer acquisition cost is $1,347. Churn rate industry average: 5.1% annually. Differentiation strategies focus on AI capabilities, integration ecosystems, and vertical specialization.",
      },
      {
        title: "Risk Factors",
        content:
          "Market saturation in core segments, regulatory compliance complexity, and rising customer acquisition costs. Economic headwinds may impact enterprise spending. Emerging open-source alternatives pose disruption threat.",
      },
    ],
    metrics: [
      { label: "Projected Market Size", value: "$323B", color: "text-emerald-400" },
      { label: "YoY Growth Rate", value: "34%", color: "text-blue-400" },
      { label: "Avg. Churn Rate", value: "5.2%", color: "text-amber-400" },
    ],
  };

  // Sample course curriculum data
  const courseData = {
    title: "Advanced B2B Sales Mastery Program",
    description:
      "A comprehensive 14-week program designed to transform sales professionals into enterprise B2B experts. Includes live coaching, practical exercises, and certification.",
    modules: [
      {
        number: 1,
        title: "Enterprise Sales Foundations",
        duration: "4 weeks",
        lessons: [
          "Understanding B2B Buyer Psychology",
          "Building a Qualified Pipeline",
          "Account-Based Selling Strategies",
          "Value Proposition Development",
        ],
      },
      {
        number: 2,
        title: "Strategic Account Management",
        duration: "3 weeks",
        lessons: [
          "Multi-Stakeholder Engagement",
          "Executive Relationship Building",
          "Navigating Complex Sales Cycles",
          "Contract Negotiation Tactics",
        ],
      },
      {
        number: 3,
        title: "Sales Technology & Analytics",
        duration: "3 weeks",
        lessons: [
          "CRM Optimization Techniques",
          "Sales Intelligence Tools",
          "Forecasting & Pipeline Management",
          "AI-Powered Sales Automation",
        ],
      },
      {
        number: 4,
        title: "Advanced Closing Strategies",
        duration: "2 weeks",
        lessons: [
          "Objection Handling Frameworks",
          "ROI Justification Models",
          "Risk Mitigation Planning",
          "Final-Sale Account Expansion",
        ],
      },
    ],
    stats: [
      { label: "Weeks", value: "14" },
      { label: "Lessons", value: "16" },
      { label: "Modules", value: "4" },
      { label: "Completion", value: "92%" },
    ],
  };

  return (
    <AppLayout title="AI Insights">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
            <p className="text-muted-foreground mt-1">Market research and curriculum generation</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button size="sm" className="glow-primary-sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="research" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="research" className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              Market Research
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              Course Curriculum
            </TabsTrigger>
          </TabsList>

          {/* Market Research Tab */}
          <TabsContent value="research" className="space-y-6">
            {/* Title */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl">{marketResearch.title}</CardTitle>
              </CardHeader>
            </Card>

            {/* Sections */}
            {marketResearch.sections.map((section, i) => (
              <Card key={i} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-indigo-400">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marketResearch.metrics.map((metric, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-sm mb-2">{metric.label}</p>
                    <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Course Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-6">
            {/* Course Header */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{courseData.title}</CardTitle>
                    <p className="text-muted-foreground mt-2">{courseData.description}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {courseData.stats.map((stat, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Modules */}
            <div className="space-y-3">
              {courseData.modules.map((module, i) => (
                <Card
                  key={i}
                  className="bg-card border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                          <span className="text-indigo-400 font-bold">M{module.number}</span>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{module.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{module.duration}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          expandedModule === i ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>

                  {/* Expanded Content */}
                  {expandedModule === i && (
                    <CardContent className="pt-0 border-t border-border">
                      <ul className="space-y-2 mt-4">
                        {module.lessons.map((lesson, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                            <span className="text-sm text-foreground">{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
