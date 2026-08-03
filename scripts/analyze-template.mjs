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
const texts = [...xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]);
texts.forEach((t, i) => console.log(i, JSON.stringify(t)));

const tables = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g) ?? [];
console.log("\n=== TABLE 0 cell text counts ===");
if (tables[0]) {
  const rows = tables[0].split("<w:tr").slice(1);
  rows.forEach((row, ri) => {
    const cellTexts = [...row.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]);
    console.log(`row ${ri}:`, cellTexts.length ? cellTexts : "(empty)");
  });
}

console.log("\n=== TABLE 1 cell text counts ===");
if (tables[1]) {
  const rows = tables[1].split("<w:tr").slice(1);
  rows.forEach((row, ri) => {
    const cellTexts = [...row.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]);
    console.log(`row ${ri}:`, cellTexts.length ? cellTexts : "(empty)");
  });
}

try {
  console.log("\nmedia:", fs.readdirSync(path.join(tmpDir, "out", "word", "media")));
} catch {
  console.log("\nno media folder");
}
