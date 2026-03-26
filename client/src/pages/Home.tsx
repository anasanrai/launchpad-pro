import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  BarChart3,
  CheckCircle2,
  LayoutDashboard,
  Mail,
  Rocket,
  Search,
  Sparkles,
  Zap,
  Globe,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: Search,
    title: "AI Market Research",
    description:
      "Generate deep-dive competitor and market analysis reports in minutes. Powered by GPT-4, Claude, and Gemini.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: BookOpen,
    title: "Course Architect",
    description:
      "Transform any topic into a structured 8-module course with lesson scripts, slide outlines, and monetization strategies.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Mail,
    title: "Cold Emailer",
    description:
      "AI-crafted hyper-personalized opening lines based on your lead's recent public activity. 45%+ open rates.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: BarChart3,
    title: "Asset Dashboard",
    description:
      "Centralized workspace to save, manage, search, and export all your generated business assets in Markdown.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Globe,
    title: "Global Payments",
    description:
      "Paddle-powered subscriptions with international tax handling. Built for non-US entrepreneurs worldwide.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    icon: Zap,
    title: "Multi-AI Engine",
    description:
      "Unified interface connecting OpenRouter, Gemini, OpenAI, and Anthropic with automatic fallback support.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
];

const stats = [
  { value: "4+", label: "AI Providers" },
  { value: "3", label: "Core Tools" },
  { value: "8", label: "Course Modules" },
  { value: "∞", label: "Asset Storage" },
];

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background bg-mesh">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary-sm">
              <Rocket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">LaunchPad Pro</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-3">
            {loading ? null : isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  Sign In
                </Button>
                <Button size="sm" onClick={() => (window.location.href = getLoginUrl())}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <Badge
            variant="outline"
            className="mb-6 border-primary/30 text-primary bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide"
          >
            <Sparkles className="w-3 h-3 mr-1.5" />
            AI-Powered B2B Growth Suite
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
            Launch Faster.
            <br />
            <span className="text-gradient">Grow Smarter.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one AI platform for entrepreneurs — from deep market research and
            course creation to hyper-personalized cold outreach. Built for global founders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="h-12 px-8 text-base glow-primary"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                View Pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to{" "}
              <span className="text-gradient">scale your business</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three powerful AI tools working together in a seamless workflow — from research
              to course creation to outreach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`p-6 rounded-xl border bg-card card-hover ${feature.border}`}
              >
                <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-4 border-y border-border">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              A connected <span className="text-gradient">workflow</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Research flows directly into course creation. Course insights power your cold outreach.
              Everything saved and exportable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Research Your Market",
                desc: "Run AI-powered competitive analysis. Identify gaps, opportunities, and ideal customer profiles.",
                icon: Search,
              },
              {
                step: "02",
                title: "Build Your Course",
                desc: "Turn market insights into a structured 8-module curriculum with scripts and slide outlines.",
                icon: BookOpen,
              },
              {
                step: "03",
                title: "Launch Your Outreach",
                desc: "Use research data to craft hyper-personalized cold emails that actually get replies.",
                icon: Mail,
              },
            ].map((step, i) => (
              <div key={step.step} className="relative">
                <div className="p-6 rounded-xl bg-card border border-border">
                  <div className="text-4xl font-black text-primary/20 mb-3">{step.step}</div>
                  <step.icon className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="p-10 rounded-2xl bg-card border border-primary/20 glow-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh opacity-50" />
            <div className="relative z-10">
              <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to accelerate your growth?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Join entrepreneurs worldwide using LaunchPad Pro to research, build, and sell faster.
                Plans start at $49/month.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="h-12 px-8 glow-primary"
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    See All Plans
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
                {["No credit card required", "Cancel anytime", "Global tax handled"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">LaunchPad Pro</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LaunchPad Pro. Built for global entrepreneurs.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


