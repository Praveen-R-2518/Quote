import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const templatePath = "c:/Users/hp/Desktop/Personal Folders/pumpkin tours and travels/TEMPLATES/Quotation TEMPLATE.docx";
const buf = fs.readFileSync(templatePath);

// docx is zip - find local file header for word/document.xml
const str = buf.toString("binary");
const idx = str.indexOf("word/document.xml");
if (idx === -1) {
  console.log("Could not find document.xml");
  process.exit(1);
}

// Use adm-zip alternative: manual unzip via child_process tar if available
import { execFileSync } from "child_process";
import os from "os";

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "quote-template-"));
const zipPath = path.join(tmpDir, "template.zip");
fs.writeFileSync(zipPath, buf);

try {
  execFileSync("powershell", [
    "-NoProfile", "-Command",
    `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${tmpDir.replace(/'/g, "''")}\\out' -Force`
  ], { stdio: "pipe" });
} catch (e) {
  console.error("Expand failed", e.message);
  process.exit(1);
}

const xmlPath = path.join(tmpDir, "out", "word", "document.xml");
const xml = fs.readFileSync(xmlPath, "utf8");

const text = xml
  .replace(/<w:tab[^/]*\/>/g, "[TAB]")
  .replace(/<\/w:p>/g, "\n")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

console.log("=== DOCUMENT TEXT ===");
console.log(text);
console.log("\n=== PARAGRAPH COUNT ===");
console.log((xml.match(/<w:p[ >]/g) || []).length);

// Also save xml snippet for structure analysis
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/template-document.xml", xml);
fs.writeFileSync("data/template-text.txt", text);
console.log("\nSaved to data/template-text.txt");
