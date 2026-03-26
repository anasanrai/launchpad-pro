import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Rocket,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isNew?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Insights", href: "/ai-insights", icon: Sparkles, isNew: true },
  { label: "Market Research", href: "/market-research", icon: Search, isNew: false },
  { label: "ROI Predictor", href: "/roi-predictor", icon: TrendingUp, isNew: true },
  { label: "Course Architect", href: "/course-architect", icon: BookOpen },
  { label: "Cold Emailer", href: "/cold-emailer", icon: Mail },
  { label: "Asset Library", href: "/assets", icon: History },
];

const bottomNavItems: NavItem[] = [
  { label: "Pricing & Plans", href: "/pricing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AppLayout({ children, title, subtitle, actions }: AppLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const subscriptionQuery = trpc.subscription.get.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const subscription = subscriptionQuery.data;
  const planLabel = subscription?.plan
    ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)
    : "Free";

  const planColors: Record<string, string> = {
    starter: "text-blue-400",
    pro: "text-violet-400",
    agency: "text-amber-400",
    Free: "text-muted-foreground",
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "LP";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <img src="/logo.svg" alt="LaunchPad Pro" className="w-8 h-8 flex-shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm text-foreground leading-tight">LaunchPad Pro</span>
          <span className="text-xs text-muted-foreground leading-tight">B2B Growth Suite</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
          AI Tools
        </div>
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.isNew && (
                  <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                    NEW
                  </span>
                )}
                {isActive && <ChevronRight className="w-3 h-3 text-primary" />}
              </div>
            </Link>
          );
        })}

        {/* Usage Stats */}
        <div className="mt-6 mb-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
            Account
          </div>
          {bottomNavItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group",
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Plan Badge */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Current Plan</span>
            <Zap className={cn("w-3 h-3", planColors[planLabel] ?? "text-muted-foreground")} />
          </div>
          <div className={cn("text-sm font-bold", planColors[planLabel] ?? "text-foreground")}>
            {planLabel}
          </div>
          {planLabel === "Free" && (
            <Link href="/pricing">
              <Button size="sm" className="w-full mt-2 h-7 text-xs" onClick={() => setSidebarOpen(false)}>
                <Sparkles className="w-3 h-3 mr-1" />
                Upgrade Now
              </Button>
            </Link>
          )}
        </div>

        {/* User Profile */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {user?.name ?? "User"}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user?.email ?? ""}
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            className="w-full"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-10">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center gap-4 px-4 lg:px-6 h-14 border-b border-border bg-background/95 backdrop-blur-sm flex-shrink-0">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            {title && (
              <div>
                <h1 className="text-base font-semibold text-foreground leading-tight truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}

          {/* Stats quick view */}
          <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>
              <span className={planColors[planLabel] ?? "text-muted-foreground"}>{planLabel}</span>
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
