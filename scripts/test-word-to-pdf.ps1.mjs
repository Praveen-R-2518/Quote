import fs from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import PizZip from "pizzip";

const execFileAsync = promisify(execFile);
const TEMPLATE = path.join(process.cwd(), "templates", "quotation-template-source.docx");

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "quote-pdf-test-"));
  const docxPath = path.join(tmpDir, "quotation.docx");
  const pdfPath = path.join(tmpDir, "quotation.pdf");
  fs.copyFileSync(TEMPLATE, docxPath);

  const psScript = path.join(tmpDir, "convert.ps1");
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

  await execFileAsync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psScript], {
    timeout: 120000,
  });

  const pdf = fs.readFileSync(pdfPath);
  console.log("PDF bytes:", pdf.length);
  console.log("PDF header:", pdf.slice(0, 5).toString());
  fs.copyFileSync(pdfPath, path.join(process.cwd(), "data", "test-from-word.pdf"));
  console.log("Saved data/test-from-word.pdf");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
