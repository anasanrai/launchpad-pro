import AppLayout from "@/components/AppLayout";
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

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or industry");
      return;
    }
    generateMutation.mutate({ topic, competitors, depth, provider, saveToAssets: true });
  };

  const handleCopy = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content);
      toast.success("Copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (result?.content) {
      const blob = new Blob([result.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `market-research-${topic.toLowerCase().replace(/\s+/g, "-")}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded as Markdown");
    }
  };

  const handleExportPDF = async () => {
    if (!result?.content) return;
    setIsExportingPDF(true);
    try {
      await exportToPDF({
        filename: `market-research-${topic.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        title: `Market Research: ${topic}`,
        content: result.content,
        type: "market_research",
      });
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF");
    } finally {
      setIsExportingPDF(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <AppLayout title="Market Research">
        <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
          <Search className="w-16 h-16 text-violet-400 mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-foreground mb-3">AI Market Research</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sign in to generate deep-dive competitor and market analysis reports.
          </p>
          <Button onClick={() => (window.location.href = getLoginUrl())}>Sign In to Access</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="AI Market Research"
      subtitle="Generate deep-dive competitor and market analysis reports"
      actions={
        result?.assetId && (
          <Link href={`/assets/${result.assetId}`}>
            <Button variant="outline" size="sm">
              <BookmarkPlus className="w-4 h-4 mr-2" />
              View Saved
            </Button>
          </Link>
        )
      }
    >
      <div className="p-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Search className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  Research Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-medium">
                    Topic / Industry <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g., AI-powered CRM for SMBs"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitors" className="text-sm font-medium">
                    Competitors to Analyze
                    <span className="text-muted-foreground text-xs ml-1">(optional)</span>
                  </Label>
                  <Textarea
                    id="competitors"
                    placeholder="e.g., Salesforce, HubSpot, Pipedrive&#10;(leave blank to auto-identify)"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    rows={3}
                    className="bg-input border-border resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Research Depth</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {depthOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDepth(opt.value as typeof depth)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          depth === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-input text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div className="text-xs opacity-70 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">AI Provider</Label>
                  <Select
                    value={provider}
                    onValueChange={(v) => setProvider(v as typeof provider)}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {providerOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full glow-primary-sm"
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !topic.trim()}
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Pro Tips
                </h3>
                <div className="space-y-2">
                  {[
                    "Be specific: 'AI CRM for e-commerce' beats 'CRM software'",
                    "Name 3-5 competitors for more targeted analysis",
                    "Use Comprehensive depth for investor-ready reports",
                    "Reports are auto-saved to your Asset Library",
                  ].map((tip) => (
                    <div key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {tip}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-3">
            {generateMutation.isPending ? (
              <Card className="bg-card border-border h-full min-h-96">
                <CardContent className="flex flex-col items-center justify-center h-full py-20">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Analyzing Market...
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Researching competitors, market size, and strategic opportunities for{" "}
                    <span className="text-primary font-medium">{topic}</span>
                  </p>
                  <div className="mt-6 flex gap-2">
                    {["Scanning competitors", "Sizing market", "Building strategy"].map(
                      (step, i) => (
                        <div
                          key={step}
                          className="text-xs text-muted-foreground flex items-center gap-1"
                          style={{ animationDelay: `${i * 0.5}s` }}
                        >
                          <Loader2 className="w-3 h-3 animate-spin" />
                          {step}
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : result ? (
              <Card className="bg-card border-border">
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <CardTitle className="text-sm">Report Generated</CardTitle>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        {result.provider} · {result.model.split("/").pop()?.split("-").slice(0, 3).join("-")}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        .md
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={isExportingPDF}>
                        {isExportingPDF ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 max-h-[calc(100vh-220px)] overflow-y-auto">
                  <Streamdown>{result.content}</Streamdown>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border h-full min-h-96">
                <CardContent className="flex flex-col items-center justify-center h-full py-20">
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-5">
                    <Search className="w-8 h-8 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Research
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                    Enter your topic and click Generate to produce a comprehensive market
                    analysis report.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground max-w-xs">
                    {[
                      "Competitive landscape",
                      "Market sizing (TAM)",
                      "Customer profiles",
                      "Go-to-market strategy",
                      "Risk assessment",
                      "Action roadmap",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-violet-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
