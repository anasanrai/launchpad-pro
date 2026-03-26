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
  BookOpen,
  CheckCircle2,
  Copy,
  Download,
  GraduationCap,
  Layers,
  Loader2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Streamdown } from "streamdown";
import { Link } from "wouter";

const levelOptions = [
  { value: "beginner", label: "Beginner", desc: "No prior knowledge needed" },
  { value: "intermediate", label: "Intermediate", desc: "Some experience required" },
  { value: "advanced", label: "Advanced", desc: "Expert-level content" },
];

const providerOptions = [
  { value: "auto", label: "Auto (Best Available)" },
  { value: "openrouter", label: "OpenRouter" },
  { value: "openai", label: "OpenAI GPT-4" },
  { value: "anthropic", label: "Anthropic Claude" },
  { value: "gemini", label: "Google Gemini" },
];

export default function CourseArchitect() {
  const { isAuthenticated } = useAuth();
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [provider, setProvider] = useState<"auto" | "openrouter" | "gemini" | "openai" | "anthropic">("auto");
  const [result, setResult] = useState<{ content: string; assetId?: number; model: string; provider: string } | null>(null);

  const generateMutation = trpc.courseArchitect.generate.useMutation({
    onSuccess: (data) => {
      setResult(data);
      toast.success("Course blueprint generated!", {
        description: `8-module curriculum powered by ${data.model}`,
      });
    },
    onError: (err) => {
      toast.error("Generation failed", { description: err.message });
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a course topic");
      return;
    }
    generateMutation.mutate({ topic, targetAudience, level, provider, saveToAssets: true });
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
      a.download = `course-${topic.toLowerCase().replace(/\s+/g, "-")}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded as Markdown");
    }
  };

  if (!isAuthenticated) {
    return (
      <AppLayout title="Course Architect">
        <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
          <BookOpen className="w-16 h-16 text-blue-400 mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-foreground mb-3">AI Course Architect</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sign in to transform any topic into a structured 8-module course.
          </p>
          <Button onClick={() => (window.location.href = getLoginUrl())}>Sign In to Access</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="AI Course Architect"
      subtitle="Transform any topic into a structured 8-module course with scripts and slide outlines"
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
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  Course Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-medium">
                    Course Topic <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g., B2B Sales Mastery for SaaS"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-sm font-medium">
                    Target Audience
                    <span className="text-muted-foreground text-xs ml-1">(optional)</span>
                  </Label>
                  <Textarea
                    id="audience"
                    placeholder="e.g., Early-stage SaaS founders with 0-5 sales reps"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    rows={2}
                    className="bg-input border-border resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Skill Level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {levelOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setLevel(opt.value as typeof level)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          level === opt.value
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
                      Building Curriculum...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Course
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* What you get */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  What You Get
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: Layers, text: "8 structured modules" },
                    { icon: BookOpen, text: "3 lessons per module" },
                    { icon: GraduationCap, text: "Detailed lesson scripts" },
                    { icon: Zap, text: "Slide outlines (5 slides/lesson)" },
                    { icon: Users, text: "Module assignments" },
                    { icon: CheckCircle2, text: "Monetization strategy" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      {text}
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
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Architecting Your Course...
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Designing 8 modules, lesson scripts, and slide outlines for{" "}
                    <span className="text-blue-400 font-medium">{topic}</span>
                  </p>
                  <div className="mt-6 space-y-1.5 text-xs text-muted-foreground">
                    {[
                      "Structuring learning outcomes...",
                      "Writing lesson scripts...",
                      "Creating slide outlines...",
                    ].map((step) => (
                      <div key={step} className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
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
                      <CardTitle className="text-sm">Course Blueprint Ready</CardTitle>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        {result.provider} · 8 modules
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
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Course Architect Ready
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                    Enter your course topic and generate a complete 8-module curriculum with
                    lesson scripts and slide outlines.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground max-w-xs">
                    {[
                      "Module objectives",
                      "Lesson scripts",
                      "Slide outlines",
                      "Assignments",
                      "Resources",
                      "Final project",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-blue-400" />
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
