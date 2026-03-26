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
  BookmarkPlus,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Mail,
  MessageSquare,
  Sparkles,
  Target,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Streamdown } from "streamdown";
import { Link } from "wouter";

const providerOptions = [
  { value: "auto", label: "Auto (Best Available)" },
  { value: "openrouter", label: "OpenRouter" },
  { value: "openai", label: "OpenAI GPT-4" },
  { value: "anthropic", label: "Anthropic Claude" },
  { value: "gemini", label: "Google Gemini" },
];

export default function ColdEmailer() {
  const { isAuthenticated } = useAuth();
  const [leadName, setLeadName] = useState("");
  const [company, setCompany] = useState("");
  const [activity, setActivity] = useState("");
  const [senderProduct, setSenderProduct] = useState("");
  const [variations, setVariations] = useState(3);
  const [provider, setProvider] = useState<"auto" | "openrouter" | "gemini" | "openai" | "anthropic">("auto");
  const [result, setResult] = useState<{ content: string; assetId?: number; model: string; provider: string } | null>(null);

  const generateMutation = trpc.coldEmailer.generate.useMutation({
    onSuccess: (data) => {
      setResult(data);
      toast.success(`${variations} email variations generated!`, {
        description: `Hyper-personalized for ${leadName} @ ${company}`,
      });
    },
    onError: (err) => {
      toast.error("Generation failed", { description: err.message });
    },
  });

  const handleGenerate = () => {
    if (!leadName.trim() || !company.trim() || !activity.trim() || !senderProduct.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    generateMutation.mutate({
      leadName,
      company,
      activity,
      senderProduct,
      variations,
      provider,
      saveToAssets: true,
    });
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
      a.download = `cold-email-${leadName.toLowerCase().replace(/\s+/g, "-")}-${company.toLowerCase().replace(/\s+/g, "-")}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded as Markdown");
    }
  };

  if (!isAuthenticated) {
    return (
      <AppLayout title="Cold Emailer">
        <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
          <Mail className="w-16 h-16 text-emerald-400 mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Hyper-Personalized Cold Emailer</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sign in to generate personalized cold emails based on your lead's recent activity.
          </p>
          <Button onClick={() => (window.location.href = getLoginUrl())}>Sign In to Access</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Hyper-Personalized Cold Emailer"
      subtitle="AI-crafted opening lines based on your lead's recent public activity"
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
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  Lead Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="leadName" className="text-sm font-medium">
                      Lead Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="leadName"
                      placeholder="e.g., Sarah Chen"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">
                      Company <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="company"
                      placeholder="e.g., Acme Corp"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity" className="text-sm font-medium">
                    Recent Public Activity / Context{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="activity"
                    placeholder="e.g., Just posted on LinkedIn about scaling their sales team from 3 to 15 reps. Mentioned challenges with CRM adoption and data hygiene. Recently promoted to VP of Sales."
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    rows={4}
                    className="bg-input border-border resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste LinkedIn posts, tweets, news mentions, or any recent activity.
                    More context = more personalization.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product" className="text-sm font-medium">
                    Your Product / Service <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="product"
                    placeholder="e.g., AI-powered CRM that auto-logs calls, emails, and meetings. Reduces manual data entry by 80%. Used by 200+ SaaS companies."
                    value={senderProduct}
                    onChange={(e) => setSenderProduct(e.target.value)}
                    rows={3}
                    className="bg-input border-border resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Variations</Label>
                    <Select
                      value={String(variations)}
                      onValueChange={(v) => setVariations(Number(v))}
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} variation{n > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                </div>

                <Button
                  className="w-full glow-primary-sm"
                  onClick={handleGenerate}
                  disabled={
                    generateMutation.isPending ||
                    !leadName.trim() ||
                    !company.trim() ||
                    !activity.trim() ||
                    !senderProduct.trim()
                  }
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Crafting Emails...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Emails
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Personalization Tips
                </h3>
                <div className="space-y-2">
                  {[
                    "Copy-paste their LinkedIn post verbatim for best results",
                    "Include recent company news or funding announcements",
                    "Mention job changes or promotions for strong hooks",
                    "Add podcast appearances or speaking engagements",
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
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Crafting Personalized Emails...
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Writing {variations} hyper-personalized email variation{variations > 1 ? "s" : ""}{" "}
                    for <span className="text-emerald-400 font-medium">{leadName}</span> at{" "}
                    <span className="text-emerald-400 font-medium">{company}</span>
                  </p>
                  <div className="mt-6 space-y-1.5 text-xs text-muted-foreground">
                    {[
                      "Analyzing lead activity...",
                      "Crafting opening hooks...",
                      "Writing follow-up sequence...",
                    ].map((step) => (
                      <div key={step} className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                        {step}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : result ? (
              <Card className="bg-card border-border">
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <CardTitle className="text-sm">Emails Generated</CardTitle>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        {variations} variation{variations > 1 ? "s" : ""} · {result.provider}
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
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                    <Mail className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Cold Emailer Ready
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                    Fill in your lead's details and recent activity to generate
                    hyper-personalized emails that stand out.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground max-w-xs">
                    {[
                      "Personalized subject lines",
                      "Activity-based hooks",
                      "Pain point bridges",
                      "Social proof snippets",
                      "Low-friction CTAs",
                      "Follow-up sequence",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-emerald-400" />
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
