import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, TrendingUp, AlertCircle, Lightbulb, Target, Zap } from "lucide-react";
import { useState } from "react";
import { Streamdown } from "streamdown";

export default function ROIPredictor() {
  const { isAuthenticated } = useAuth();
  const [marketResearchContent, setMarketResearchContent] = useState("");
  const [topic, setTopic] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [prediction, setPrediction] = useState<any>(null);

  const predictMutation = trpc.roiPredictor.predict.useMutation({
    onSuccess: (data) => {
      setPrediction(data.prediction);
      toast.success("ROI analysis complete!", {
        description: `Success probability: ${data.prediction.successProbability}%`,
      });
    },
    onError: (err) => {
      toast.error("Failed to predict ROI", { description: err.message });
    },
  });

  const handlePredict = () => {
    if (!marketResearchContent.trim()) {
      toast.error("Market research content required");
      return;
    }
    if (!topic.trim()) {
      toast.error("Topic required");
      return;
    }

    predictMutation.mutate({
      marketResearchContent,
      topic,
      targetMarket,
      saveToAssets: true,
    });
  };

  const getSuccessColor = (probability: number) => {
    if (probability >= 70) return "text-emerald-400";
    if (probability >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const getCompetitionColor = (level: string) => {
    if (level === "low") return "text-emerald-400";
    if (level === "medium") return "text-amber-400";
    return "text-red-400";
  };

  return (
    <AppLayout
      title="Market ROI Predictor"
      subtitle="Analyze market research and predict success probability & revenue potential"
    >
      <div className="p-6 max-w-4xl space-y-6">
        {/* Input Section */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              ROI Analysis Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Topic / Niche *
              </label>
              <Input
                placeholder="e.g., AI-powered CRM for SMBs"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Target Market (Optional)
              </label>
              <Input
                placeholder="e.g., Mid-market B2B SaaS companies in US/EU"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Market Research Content *
              </label>
              <Textarea
                placeholder="Paste your market research report here (from Market Research module or external source)"
                value={marketResearchContent}
                onChange={(e) => setMarketResearchContent(e.target.value)}
                className="bg-input border-border min-h-48 font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Minimum 100 characters. Include competitor analysis, market size, trends.
              </p>
            </div>

            <Button
              onClick={handlePredict}
              disabled={predictMutation.isPending || !isAuthenticated}
              className="w-full glow-primary-sm"
            >
              {predictMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {predictMutation.isPending ? "Analyzing..." : "Predict ROI"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {prediction && (
          <div className="space-y-6">
            {/* Success Probability Gauge */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Success Probability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl font-bold" style={{ color: "var(--primary)" }}>
                    {prediction.successProbability}%
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-2">Confidence Level</p>
                    <Badge
                      className={`text-sm ${getSuccessColor(prediction.successProbability)} border-current/30`}
                    >
                      {prediction.successProbability >= 70
                        ? "High"
                        : prediction.successProbability >= 50
                          ? "Medium"
                          : "Low"}
                    </Badge>
                  </div>
                </div>

                {/* Gauge visualization */}
                <div className="w-full h-3 bg-input rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${prediction.successProbability}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Revenue Potential */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Revenue Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-input border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Annual Revenue Potential</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${(prediction.revenuePotentialUSD || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-input border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Total Addressable Market</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${(prediction.marketSizeEstimate || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competition & Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Competition Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                    <span className={getCompetitionColor(prediction.competitionLevel)}>
                      {prediction.competitionLevel?.charAt(0).toUpperCase() +
                        prediction.competitionLevel?.slice(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Time to Breakeven</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {prediction.timeToBreakeven}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risks */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Key Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prediction.keyRisks?.map((risk: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Key Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prediction.keyOpportunities?.map((opp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-amber-400 font-bold mt-0.5">•</span>
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommended Strategy */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Recommended Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {prediction.recommendedStrategy}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!prediction && !predictMutation.isPending && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="w-12 h-12 text-primary mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Paste your market research and enter your topic to get an ROI prediction.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
