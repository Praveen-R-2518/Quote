/**
 * Remove the TOUR PERIOD / PAX / ROOMS summary table from the default template.
 * Run: node scripts/remove-tour-period-table.mjs
 */
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import { execFileSync } from "child_process";
import os from "os";

const TEMPLATE_PATH = path.join(process.cwd(), "templates", "quotation-template-source.docx");

const zip = new PizZip(fs.readFileSync(TEMPLATE_PATH));
let xml = zip.file("word/document.xml").asText();

const tables = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g) ?? [];
let removed = false;

for (const table of tables) {
  if (table.includes("TOUR PERIOD") && table.includes("PAX") && table.includes("ROOMS") && !table.includes("QTY")) {
    xml = xml.replace(table, "");
    removed = true;
    console.log("Removed TOUR PERIOD / PAX / ROOMS table");
    break;
  }
}

if (!removed) {
  console.log("TOUR PERIOD table already removed — no changes");
  process.exit(0);
}

zip.file("word/document.xml", xml);
fs.writeFileSync(TEMPLATE_PATH, zip.generate({ type: "nodebuffer", compression: "DEFLATE" }));

// Print updated w:t indices
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "quote-check-"));
const zipPath = path.join(tmpDir, "t.zip");
fs.writeFileSync(zipPath, fs.readFileSync(TEMPLATE_PATH));
execFileSync("powershell", [
  "-NoProfile", "-Command",
  `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${path.join(tmpDir, "out").replace(/'/g, "''")}' -Force`,
], { stdio: "pipe" });

const updatedXml = fs.readFileSync(path.join(tmpDir, "out", "word", "document.xml"), "utf8");
const texts = [...updatedXml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]);
texts.forEach((t, i) => {
  if (/TOUR|PERIOD|PAX|ROOM|DAY|QTY|24\.|PER PERSON|Hanuman/i.test(t) || i >= 50 && i <= 100) {
    console.log(i, JSON.stringify(t));
  }
});

console.log("\nTemplate updated:", TEMPLATE_PATH);
