import { parse } from "csv-parse/sync";

export interface CSVLead {
  name: string;
  email: string;
  company?: string;
  title?: string;
  recentActivity?: string;
  industry?: string;
  linkedinProfile?: string;
}

export interface CSVImportResult {
  total: number;
  valid: number;
  invalid: number;
  leads: CSVLead[];
  errors: Array<{ row: number; error: string }>;
}

export function parseCSV(fileContent: string): CSVImportResult {
  const errors: Array<{ row: number; error: string }> = [];
  const leads: CSVLead[] = [];

  try {
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    records.forEach((record, index) => {
      const row = index + 2; // +2 because index starts at 0 and row 1 is header

      // Validate required fields
      if (!record.name || !record.email) {
        errors.push({
          row,
          error: "Missing required fields: name and email",
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(record.email)) {
        errors.push({
          row,
          error: `Invalid email format: ${record.email}`,
        });
        return;
      }

      leads.push({
        name: record.name.trim(),
        email: record.email.trim(),
        company: record.company?.trim(),
        title: record.title?.trim(),
        recentActivity: record.recentActivity?.trim(),
        industry: record.industry?.trim(),
        linkedinProfile: record.linkedinProfile?.trim(),
      });
    });

    return {
      total: records.length,
      valid: leads.length,
      invalid: errors.length,
      leads,
      errors,
    };
  } catch (error) {
    throw new Error(
      `CSV parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function generateBulkEmails(
  leads: CSVLead[],
  template: string,
  onProgress?: (current: number, total: number) => void
): Promise<Array<{ lead: CSVLead; email: string }>> {
  const results: Array<{ lead: CSVLead; email: string }> = [];

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    if (!lead) continue;

    // Generate personalized email for this lead
    const personalizedEmail = generatePersonalizedEmail(lead, template);
    results.push({
      lead,
      email: personalizedEmail,
    });

    onProgress?.(i + 1, leads.length);
  }

  return results;
}

function generatePersonalizedEmail(lead: CSVLead, template: string): string {
  let email = template;

  // Replace placeholders with actual data
  email = email.replace(/\{name\}/g, lead.name);
  email = email.replace(/\{email\}/g, lead.email);
  email = email.replace(/\{company\}/g, lead.company || "your company");
  email = email.replace(/\{title\}/g, lead.title || "your role");
  email = email.replace(/\{activity\}/g, lead.recentActivity || "recent activity");
  email = email.replace(/\{industry\}/g, lead.industry || "industry");

  return email;
}

export function generateCSVExport(
  data: Array<{ lead: CSVLead; email: string }>
): string {
  const headers = [
    "Name",
    "Email",
    "Company",
    "Title",
    "Industry",
    "Generated Email",
  ];
  const rows = data.map((item) => [
    item.lead.name,
    item.lead.email,
    item.lead.company || "",
    item.lead.title || "",
    item.lead.industry || "",
    `"${item.email.replace(/"/g, '""')}"`, // Escape quotes in email
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csv;
}
