import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export class PdfConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfConversionError";
  }
}

/**
 * Convert a filled quotation DOCX buffer to PDF using Microsoft Word on Windows.
 * This preserves the official template layout, logo, colours, and typography.
 */
export async function convertDocxBufferToPdf(docxBuffer: Buffer): Promise<Buffer> {
  if (process.platform !== "win32") {
    throw new PdfConversionError(
      "PDF export currently requires Microsoft Word on Windows so the PDF matches the official template."
    );
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "quote-pdf-"));
  const docxPath = path.join(tmpDir, "quotation.docx");
  const pdfPath = path.join(tmpDir, "quotation.pdf");
  const psScript = path.join(tmpDir, "convert.ps1");

  try {
    fs.writeFileSync(docxPath, docxBuffer);
    fs.writeFileSync(
      psScript,
      `
$ErrorActionPreference = "Stop"
$docxPath = ${JSON.stringify(docxPath)}
$pdfPath = ${JSON.stringify(pdfPath)}
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  $doc = $word.Documents.Open($docxPath)
  $doc.ExportAsFixedFormat($pdfPath, 17)
  $doc.Close($false)
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
  [GC]::Collect()
}
`
    );

    await execFileAsync(
      "powershell",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psScript],
      { timeout: 120000 }
    );

    if (!fs.existsSync(pdfPath)) {
      throw new PdfConversionError("Word did not produce a PDF file.");
    }

    return fs.readFileSync(pdfPath);
  } catch (error) {
    const message =
      error instanceof PdfConversionError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unknown conversion error";
    throw new PdfConversionError(
      `Could not convert Word document to PDF. Ensure Microsoft Word is installed. (${message})`
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
