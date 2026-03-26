import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Mail,
  Pencil,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { Streamdown } from "streamdown";
import { formatDistanceToNow, format } from "date-fns";

const typeConfig = {
  market_research: {
    label: "Market Research",
    icon: Search,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  course: {
    label: "Course Blueprint",
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

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const utils = trpc.useUtils();
  const assetId = Number(id);

  const assetQuery = trpc.assets.get.useQuery(
    { id: assetId },
    { enabled: isAuthenticated && !isNaN(assetId) }
  );

  const updateMutation = trpc.assets.update.useMutation({
    onSuccess: () => {
      utils.assets.get.invalidate({ id: assetId });
      utils.assets.list.invalidate();
      setIsEditingTitle(false);
      toast.success("Asset updated");
    },
  });

  const deleteMutation = trpc.assets.delete.useMutation({
    onSuccess: () => {
      navigate("/assets");
      toast.success("Asset deleted");
    },
  });

  const asset = assetQuery.data;

  const handleCopy = () => {
    if (asset?.content) {
      navigator.clipboard.writeText(asset.content);
      toast.success("Copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (asset?.content) {
      const blob = new Blob([asset.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${asset.title.toLowerCase().replace(/\s+/g, "-")}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded as Markdown");
    }
  };

  const handleDelete = () => {
    if (confirm("Delete this asset? This cannot be undone.")) {
      deleteMutation.mutate({ id: assetId });
    }
  };

  const handleFavorite = () => {
    if (!asset) return;
    updateMutation.mutate({ id: assetId, isFavorite: asset.isFavorite === 1 ? 0 : 1 });
  };

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      updateMutation.mutate({ id: assetId, title: editTitle.trim() });
    }
  };

  if (assetQuery.isLoading) {
    return (
      <AppLayout title="Loading...">
        <div className="p-6 space-y-4">
          <div className="h-8 w-64 shimmer rounded" />
          <div className="h-96 shimmer rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!asset) {
    return (
      <AppLayout title="Asset Not Found">
        <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
          <h2 className="text-2xl font-bold text-foreground mb-3">Asset Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This asset may have been deleted or doesn't exist.
          </p>
          <Link href="/assets">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const config = typeConfig[asset.type];

  return (
    <AppLayout
      title={asset.title}
      subtitle={`${config.label} · Created ${format(new Date(asset.createdAt), "MMM d, yyyy")}`}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            className={asset.isFavorite === 1 ? "text-amber-400" : "text-muted-foreground"}
          >
            <Star
              className={`w-4 h-4 ${asset.isFavorite === 1 ? "fill-amber-400" : ""}`}
            />
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Export .md
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      <div className="p-6 max-w-5xl">
        {/* Back Link */}
        <Link href="/assets">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </button>
        </Link>

        {/* Asset Header */}
        <Card className="bg-card border-border mb-5">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <config.icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  {isEditingTitle ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-input border-border h-8 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveTitle();
                          if (e.key === "Escape") setIsEditingTitle(false);
                        }}
                      />
                      <Button size="sm" className="h-8" onClick={handleSaveTitle}>
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => setIsEditingTitle(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-foreground leading-snug">
                        {asset.title}
                      </h2>
                      <button
                        onClick={() => {
                          setEditTitle(asset.title);
                          setIsEditingTitle(true);
                        }}
                        className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    <Badge
                      variant="outline"
                      className={`text-xs ${config.color} border-current/30`}
                    >
                      {config.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
                    </span>
                    {asset.isFavorite === 1 && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Content
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 text-xs">
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy Markdown
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownload} className="h-7 text-xs">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download .md
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Streamdown>{asset.content}</Streamdown>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
