import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import os from "os";

const templatePath = path.join(process.cwd(), "templates", "quotation-template-source.docx");
const buf = fs.readFileSync(templatePath);
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "quote-analyze-"));
const zipPath = path.join(tmpDir, "template.zip");
fs.writeFileSync(zipPath, buf);
execFileSync("powershell", [
  "-NoProfile", "-Command",
  `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${path.join(tmpDir, "out").replace(/'/g, "''")}' -Force`,
], { stdio: "pipe" });

const xml = fs.readFileSync(path.join(tmpDir, "out", "word", "document.xml"), "utf8");
const tables = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g) ?? [];

function showRow(tableXml, rowIndex) {
  const rows = tableXml.split("<w:tr").slice(1);
  const row = rows[rowIndex];
  if (!row) return;
  console.log(row.slice(0, 1500).replace(/\s+/g, " "));
}

console.log("=== TABLE 0 ROW 5 (first 1500 chars) ===");
showRow(tables[0], 5);
console.log("\n=== TABLE 1 ROW 5 ===");
showRow(tables[1], 5);

// Find a sample run from tour plan for cloning rPr
const tourPlanRow = xml.split("DAY 01")[0].length;
const sampleRun = xml.match(/<w:r>[\s\S]*?DAY 01[\s\S]*?<\/w:r>/);
console.log("\n=== SAMPLE RUN around DAY 01 ===");
console.log(sampleRun?.[0]?.slice(0, 800));
