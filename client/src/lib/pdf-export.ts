import html2pdf from "html2pdf.js";

export interface PDFExportOptions {
  filename: string;
  title: string;
  content: string;
  type: "market_research" | "course" | "email_campaign" | "roi_prediction";
}

export async function exportToPDF(options: PDFExportOptions): Promise<void> {
  const { filename, title, content, type } = options;

  // Create HTML wrapper with LaunchPad Pro branding
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #1a1a1a;
            line-height: 1.6;
            background: #ffffff;
          }
          
          .pdf-container {
            max-width: 8.5in;
            height: 11in;
            margin: 0 auto;
            padding: 0.75in;
            background: white;
          }
          
          .pdf-header {
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .pdf-logo {
            font-weight: 700;
            font-size: 18px;
            color: #1a1a1a;
          }
          
          .pdf-logo-subtitle {
            font-size: 11px;
            color: #666;
            margin-top: 2px;
          }
          
          .pdf-meta {
            text-align: right;
            font-size: 10px;
            color: #999;
          }
          
          .pdf-meta-item {
            margin-bottom: 4px;
          }
          
          .pdf-title {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 1.5rem;
            line-height: 1.2;
          }
          
          .pdf-content {
            font-size: 11px;
            color: #333;
            line-height: 1.5;
          }
          
          .pdf-content h1 {
            font-size: 18px;
            font-weight: 700;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: #1a1a1a;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 0.5rem;
          }
          
          .pdf-content h2 {
            font-size: 14px;
            font-weight: 600;
            margin-top: 1.25rem;
            margin-bottom: 0.5rem;
            color: #374151;
          }
          
          .pdf-content h3 {
            font-size: 12px;
            font-weight: 600;
            margin-top: 1rem;
            margin-bottom: 0.4rem;
            color: #4b5563;
          }
          
          .pdf-content p {
            margin-bottom: 0.75rem;
          }
          
          .pdf-content ul, .pdf-content ol {
            margin-left: 1.5rem;
            margin-bottom: 0.75rem;
          }
          
          .pdf-content li {
            margin-bottom: 0.3rem;
          }
          
          .pdf-content strong {
            font-weight: 600;
            color: #1a1a1a;
          }
          
          .pdf-content code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
          }
          
          .pdf-content pre {
            background: #f3f4f6;
            padding: 0.75rem;
            border-radius: 4px;
            margin: 0.75rem 0;
            overflow-x: auto;
            font-size: 9px;
          }
          
          .pdf-content blockquote {
            border-left: 3px solid #4f46e5;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #666;
            font-style: italic;
          }
          
          .pdf-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-size: 10px;
          }
          
          .pdf-content th {
            background: #f3f4f6;
            padding: 0.5rem;
            text-align: left;
            font-weight: 600;
            border: 1px solid #d1d5db;
          }
          
          .pdf-content td {
            padding: 0.5rem;
            border: 1px solid #d1d5db;
          }
          
          .pdf-content tr:nth-child(even) td {
            background: #f9fafb;
          }
          
          .pdf-footer {
            position: fixed;
            bottom: 0.5in;
            left: 0.75in;
            right: 0.75in;
            border-top: 1px solid #e5e7eb;
            padding-top: 0.5rem;
            font-size: 9px;
            color: #999;
            display: flex;
            justify-content: space-between;
          }
          
          .pdf-footer-left {
            text-align: left;
          }
          
          .pdf-footer-right {
            text-align: right;
          }
          
          @page {
            margin: 0;
            size: letter;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .pdf-container {
              margin: 0;
              padding: 0.75in;
              max-width: 100%;
              height: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="pdf-container">
          <div class="pdf-header">
            <div>
              <div class="pdf-logo">🚀 LaunchPad Pro</div>
              <div class="pdf-logo-subtitle">AI B2B Growth Suite</div>
            </div>
            <div class="pdf-meta">
              <div class="pdf-meta-item"><strong>Type:</strong> ${getTypeLabel(type)}</div>
              <div class="pdf-meta-item"><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
              <div class="pdf-meta-item"><strong>Time:</strong> ${new Date().toLocaleTimeString()}</div>
            </div>
          </div>
          
          <div class="pdf-title">${escapeHtml(title)}</div>
          
          <div class="pdf-content">
            ${markdownToHtml(content)}
          </div>
          
          <div class="pdf-footer">
            <div class="pdf-footer-left">LaunchPad Pro © 2026 • Confidential</div>
            <div class="pdf-footer-right">Page <span class="page-number"></span></div>
          </div>
        </div>
      </body>
    </html>
  `;

  const element = document.createElement("div");
  element.innerHTML = htmlContent;

  const opt = {
    margin: 0,
    filename: `${filename}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  try {
    await (html2pdf() as any).set(opt).from(element).save();
  } catch (error) {
    console.error("PDF export failed:", error);
    throw new Error("Failed to generate PDF");
  }
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    market_research: "Market Research Report",
    course: "Course Blueprint",
    email_campaign: "Cold Email Campaign",
    roi_prediction: "ROI Prediction Analysis",
  };
  return labels[type] || "Document";
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // Inline code
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>");

  // Unordered lists
  html = html.replace(/^\* (.*?)$/gm, "<li>$1</li>");
  html = html.replace(/^- (.*?)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");

  // Ordered lists
  html = html.replace(/^\d+\. (.*?)$/gm, "<li>$1</li>");

  // Paragraphs
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";

  // Clean up multiple p tags
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>(<h[1-6]>)/g, "$1");
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");

  return html;
}
