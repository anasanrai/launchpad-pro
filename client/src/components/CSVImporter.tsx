import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  X,
} from "lucide-react";

interface CSVLead {
  name: string;
  email: string;
  company?: string;
  title?: string;
  recentActivity?: string;
  industry?: string;
  linkedinProfile?: string;
}

interface CSVImportResult {
  total: number;
  valid: number;
  invalid: number;
  leads: CSVLead[];
  errors: Array<{ row: number; error: string }>;
}

interface CSVImporterProps {
  onLeadsImported?: (leads: CSVLead[]) => void;
}

export function CSVImporter({ onLeadsImported }: CSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CSVImportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    setFile(selectedFile);
    await parseFile(selectedFile);
  };

  const parseFile = async (fileToparse: File) => {
    setIsLoading(true);
    try {
      const content = await fileToparse.text();
      const response = await fetch("/api/csv/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to parse CSV");
      }

      const result: CSVImportResult = await response.json();
      setParseResult(result);

      if (result.invalid > 0) {
        toast.warning(`${result.invalid} rows have errors`, {
          description: `${result.valid} valid leads found`,
        });
      } else {
        toast.success(`${result.valid} leads imported successfully!`);
      }

      onLeadsImported?.(result.leads);
    } catch (error) {
      toast.error("Failed to parse CSV", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      setFile(null);
      setParseResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParseResult(null);
  };

  const handleDownloadTemplate = () => {
    const template = `name,email,company,title,recentActivity,industry,linkedinProfile
John Doe,john@example.com,Acme Corp,CEO,Launched new product,SaaS,linkedin.com/in/johndoe
Jane Smith,jane@example.com,Tech Startup,CTO,Raised Series A,AI,linkedin.com/in/janesmith`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  if (!parseResult) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Bulk Import Leads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your CSV file here or click to select
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isLoading}
              className="hidden"
              id="csv-input"
            />
            <label htmlFor="csv-input">
              <Button
                asChild
                disabled={isLoading}
                className="cursor-pointer"
              >
                <span>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Select CSV File
                    </>
                  )}
                </span>
              </Button>
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="mt-3"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">CSV Format Requirements:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Required columns: <strong>name</strong>, <strong>email</strong></li>
              <li>• Optional columns: company, title, recentActivity, industry, linkedinProfile</li>
              <li>• First row should be headers</li>
              <li>• Max 1000 leads per import</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          Import Results: {parseResult.valid}/{parseResult.total} Valid
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {parseResult.valid}
            </div>
            <div className="text-xs text-muted-foreground">Valid Leads</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {parseResult.invalid}
            </div>
            <div className="text-xs text-muted-foreground">Invalid Rows</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {parseResult.total}
            </div>
            <div className="text-xs text-muted-foreground">Total Rows</div>
          </div>
        </div>

        {/* Errors */}
        {parseResult.errors.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-destructive mb-2">
                  {parseResult.errors.length} Row(s) with Errors
                </h4>
                <div className="space-y-1 text-xs text-muted-foreground max-h-40 overflow-y-auto">
                  {parseResult.errors.slice(0, 10).map((err, idx) => (
                    <div key={idx}>
                      Row {err.row}: {err.error}
                    </div>
                  ))}
                  {parseResult.errors.length > 10 && (
                    <div className="text-muted-foreground">
                      ... and {parseResult.errors.length - 10} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {parseResult.valid > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Preview (First 5 Leads)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 text-muted-foreground">Name</th>
                    <th className="text-left p-2 text-muted-foreground">Email</th>
                    <th className="text-left p-2 text-muted-foreground">Company</th>
                    <th className="text-left p-2 text-muted-foreground">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {parseResult.leads.slice(0, 5).map((lead, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="p-2">{lead.name}</td>
                      <td className="p-2 text-muted-foreground">{lead.email}</td>
                      <td className="p-2 text-muted-foreground">{lead.company || "-"}</td>
                      <td className="p-2 text-muted-foreground">{lead.title || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parseResult.valid > 5 && (
              <p className="text-xs text-muted-foreground mt-2">
                ... and {parseResult.valid - 5} more leads
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            disabled={parseResult.valid === 0 || isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Emails...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Generate {parseResult.valid} Emails
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
