import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import os from "os";

const templatePath = path.join(process.cwd(), "templates", "quotation-template-source.docx");
const buf = fs.readFileSync(templatePath);
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "quote-tour-"));
const zipPath = path.join(tmpDir, "template.zip");
fs.writeFileSync(zipPath, buf);
execFileSync("powershell", [
  "-NoProfile", "-Command",
  `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${path.join(tmpDir, "out").replace(/'/g, "''")}' -Force`,
], { stdio: "pipe" });

const xml = fs.readFileSync(path.join(tmpDir, "out", "word", "document.xml"), "utf8");
const tables = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g);
const t1 = tables[1];
const rows = t1.split("<w:tr").slice(1);
rows.forEach((r, i) => {
  const texts = [...r.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]);
  console.log(`row ${i}: ${texts.length} texts`, texts);
});

// Show middle-day block (rows 6-8) length
const block = rows.slice(6, 9).map((r) => "<w:tr" + r).join("");
console.log("\nMiddle block chars:", block.length);
