import express, { Router } from "express";
import { parseCSV, generateBulkEmails, generateCSVExport } from "../csv-importer";
import { createContext } from "../_core/context";
import type { Request, Response } from "express";

const router = Router();

interface CSVImportRequest extends Request {
  body: {
    csvContent: string;
    template?: string;
  };
}

// Parse and validate CSV file
router.post("/parse", async (req: CSVImportRequest, res: Response) => {
  try {
    const { csvContent } = req.body;

    if (!csvContent) {
      return res.status(400).json({ error: "CSV content is required" });
    }

    const result = parseCSV(csvContent);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "CSV parsing failed",
    });
  }
});

// Generate bulk emails from CSV
router.post("/generate-emails", async (req: CSVImportRequest, res: Response) => {
  try {
    const { csvContent, template } = req.body;

    if (!csvContent || !template) {
      return res.status(400).json({
        error: "CSV content and email template are required",
      });
    }

    const parseResult = parseCSV(csvContent);

    if (parseResult.invalid > 0) {
      return res.status(400).json({
        error: `CSV contains ${parseResult.invalid} invalid rows`,
        details: parseResult.errors,
      });
    }

    const emails = await generateBulkEmails(parseResult.leads, template);
    res.json({
      total: emails.length,
      emails,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Email generation failed",
    });
  }
});

// Export generated emails as CSV
router.post("/export-csv", async (req: CSVImportRequest, res: Response) => {
  try {
    const { csvContent, template } = req.body;

    if (!csvContent || !template) {
      return res.status(400).json({
        error: "CSV content and email template are required",
      });
    }

    const parseResult = parseCSV(csvContent);

    if (parseResult.invalid > 0) {
      return res.status(400).json({
        error: `CSV contains ${parseResult.invalid} invalid rows`,
      });
    }

    const emails = await generateBulkEmails(parseResult.leads, template);
    const csv = generateCSVExport(emails);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=generated-emails.csv");
    res.send(csv);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Export failed",
    });
  }
});

export default router;
