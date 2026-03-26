import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BookOpen,
  Clock,
  FileText,
  Heart,
  Mail,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

const typeConfig = {
  market_research: {
    label: "Market Research",
    icon: Search,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  course: {
    label: "Course",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  email_campaign: {
    label: "Email Campaign",
    icon: Mail,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
};

export default function AssetHistory() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const utils = trpc.useUtils();

  const assetsQuery = trpc.assets.list.useQuery(
    {
      search: debouncedSearch || undefined,
      type: typeFilter !== "all" ? (typeFilter as "market_research" | "course" | "email_campaign") : undefined,
      limit: 50,
      offset: 0,
    },
    { enabled: isAuthenticated }
  );

  const deleteMutation = trpc.assets.delete.useMutation({
    onSuccess: () => {
      utils.assets.list.invalidate();
      utils.assets.stats.invalidate();
      toast.success("Asset deleted");
    },
    onError: () => toast.error("Failed to delete asset"),
  });

  const favoriteMutation = trpc.assets.update.useMutation({
    onSuccess: () => utils.assets.list.invalidate(),
  });

  const handleSearchChange = (val: string) => {
    setSearch(val);
    clearTimeout((window as unknown as { _searchTimeout?: ReturnType<typeof setTimeout> })._searchTimeout);
    (window as unknown as { _searchTimeout?: ReturnType<typeof setTimeout> })._searchTimeout = setTimeout(() => {
      setDebouncedSearch(val);
    }, 400);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this asset? This cannot be undone.")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleFavorite = (id: number, current: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favoriteMutation.mutate({ id, isFavorite: current === 1 ? 0 : 1 });
  };

  if (!isAuthenticated) {
    return (
      <AppLayout title="Asset Library">
        <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
          <FileText className="w-16 h-16 text-primary mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Asset Library</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sign in to access your saved reports, courses, and email campaigns.
          </p>
          <Button onClick={() => (window.location.href = getLoginUrl())}>Sign In to Access</Button>
        </div>
      </AppLayout>
    );
  }

  const assets = assetsQuery.data ?? [];

  return (
    <AppLayout
      title="Asset Library"
      subtitle="All your generated reports, courses, and email campaigns"
    >
      <div className="p-6 max-w-7xl">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 bg-input border-border"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-input border-border">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="market_research">Market Research</SelectItem>
              <SelectItem value="course">Courses</SelectItem>
              <SelectItem value="email_campaign">Email Campaigns</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Asset Grid */}
        {assetsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 rounded-xl shimmer" />
            ))}
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-xl">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {search || typeFilter !== "all" ? "No assets match your search" : "No assets yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {search || typeFilter !== "all"
                ? "Try adjusting your filters"
                : "Generate your first market research, course, or email campaign"}
            </p>
            {!search && typeFilter === "all" && (
              <div className="flex gap-3 justify-center">
                <Link href="/market-research">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Research
                  </Button>
                </Link>
                <Link href="/course-architect">
                  <Button variant="outline" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Course
                  </Button>
                </Link>
                <Link href="/cold-emailer">
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => {
              const config = typeConfig[asset.type];
              return (
                <Link key={asset.id} href={`/assets/${asset.id}`}>
                  <div
                    className={`p-4 rounded-xl bg-card border ${config.border} card-hover cursor-pointer group`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
                        >
                          <config.icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${config.color} border-current/30 flex-shrink-0`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={(e) => handleFavorite(asset.id, asset.isFavorite, e)}
                          className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              asset.isFavorite === 1
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => handleDelete(asset.id, e)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-medium text-foreground text-sm leading-snug line-clamp-2 mb-2">
                      {asset.title}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {asset.content.slice(0, 120)}...
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
                      {asset.isFavorite === 1 && (
                        <Heart className="w-3 h-3 text-amber-400 fill-amber-400 ml-auto" />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
