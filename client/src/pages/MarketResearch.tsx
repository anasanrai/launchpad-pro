import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowRight,
  BookmarkPlus,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Streamdown } from "streamdown";
import { Link } from "wouter";
import { exportToPDF } from "@/lib/pdf-export";
import { useStream } from "@/hooks/useStream";
import AppLayout from "@/components/AppLayout";

const depthOptions = [
  { value: "quick", label: "Quick Scan", desc: "~2 min, key insights" },
  { value: "standard", label: "Standard", desc: "~4 min, balanced depth" },
  { value: "comprehensive", label: "Comprehensive", desc: "~8 min, deep dive" },
];

const providerOptions = [
  { value: "auto", label: "Auto (Best Available)" },
  { value: "openrouter", label: "OpenRouter" },
  { value: "openai", label: "OpenAI GPT-4" },
  { value: "anthropic", label: "Anthropic Claude" },
  { value: "gemini", label: "Google Gemini" },
];

export default function MarketResearch() {
  const { isAuthenticated } = useAuth();
  const [topic, setTopic] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [depth, setDepth] = useState<"quick" | "standard" | "comprehensive">("comprehensive");
  const [provider, setProvider] = useState<"auto" | "openrouter" | "gemini" | "openai" | "anthropic">("auto");
  const [result, setResult] = useState<{ content: string; assetId?: number; model: string; provider: string } | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const { stream, content: streamingContent, isLoading: isStreaming, error: streamError, reset: resetStream } = useStream();

  const generateMutation = trpc.marketResearch.generate.useMutation({
    onSuccess: (data) => {
      setResult(data);
      toast.success("Market research report generated!", {
        description: `Powered by ${data.model}`,
      });
    },
    onError: (err) => {
      toast.error("Generation failed", { description: err.message });
    },
  });

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or industry");
      return;
    }

    resetStream();
    
    try {
      const content = await stream("/api/stream/market-research", {
        market: topic,
        competitors,
        depth,
      });

      if (content) {
        setResult({
          content,
          model: "Streaming",
          provider: provider || "auto",
        });
      }
    } catch (err) {
      toast.error("Streaming failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleCopy = () => {
    const contentToCopy = streamingContent || result?.content;
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      toast.success("Copied to clipboard!");
    }
  };

  const handleExportPDF = async () => {
    const contentToExport = streamingContent || result?.content;
    if (!contentToExport) return;

    setIsExportingPDF(true);
    try {
           exportToPDF({
        content: contentToExport,
        filename: `Market-Research-${topic.replace(/\s+/g, "-")}.pdf`,
        title: `Market Research: ${topic}`,
        type: "market_research",
      });
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("PDF export failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <AppLayout title="Market Research">
        <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
          <Search className="w-16 h-16 text-primary mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-foreground mb-3">AI Market Research</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sign in to generate deep-dive market analysis reports powered by AI.
          </p>
          <Button onClick={() => (window.location.href = getLoginUrl())}>Sign In</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="AI Market Research"
      subtitle="Generate deep-dive competitor and market analysis reports"
    >
      <div className="p-6 max-w-5xl space-y-6">
        {/* Input Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Research Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="topic" className="text-sm font-medium">
                Market or Industry
              </Label>
              <Input
                id="topic"
                placeholder="e.g., AI-powered CRM for SMBs, Fitness Tech, SaaS Analytics"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isStreaming || generateMutation.isPending}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="competitors" className="text-sm font-medium">
                Key Competitors (comma-separated)
              </Label>
              <Textarea
                id="competitors"
                placeholder="e.g., Salesforce, HubSpot, Pipedrive"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                disabled={isStreaming || generateMutation.isPending}
                className="mt-2 min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="depth" className="text-sm font-medium">
                  Analysis Depth
                </Label>
                <Select value={depth} onValueChange={(v) => setDepth(v as any)} disabled={isStreaming || generateMutation.isPending}>
                  <SelectTrigger id="depth" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {depthOptions.map(({ value, label, desc }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex flex-col">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground">{desc}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="provider" className="text-sm font-medium">
                  AI Provider
                </Label>
                <Select value={provider} onValueChange={(v) => setProvider(v as any)} disabled={isStreaming || generateMutation.isPending}>
                  <SelectTrigger id="provider" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providerOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isStreaming || generateMutation.isPending || !topic.trim()}
              className="w-full"
              size="lg"
            >
              {isStreaming || generateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Market Research
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Streaming Status */}
        {isStreaming && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-sm text-foreground">
                  Generating report... {streamingContent.length} characters received
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {streamError && (
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{streamError.message}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {(streamingContent || result?.content) && (
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Market Research Report</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  disabled={isStreaming}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportPDF}
                  disabled={isStreaming || isExportingPDF}
                >
                  {isExportingPDF ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-1" />
                  )}
                  PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <Streamdown>{streamingContent || result?.content || ""}</Streamdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!streamingContent && !result?.content && !isStreaming && (
          <Card className="bg-card border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Enter a market or industry to generate a comprehensive analysis report.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
