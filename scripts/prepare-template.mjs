/**
 * Ensures the Pumpkin Tours quotation template is present in templates/.
 * Copies from the source path if the destination file is missing.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const dest = path.join(root, "templates", "quotation-template-source.docx");
const sources = [
  path.join(root, "templates", "quotation-template-source.docx"),
  "c:/Users/hp/Desktop/Personal Folders/pumpkin tours and travels/TEMPLATES/Quotation TEMPLATE.docx",
];

if (!fs.existsSync(dest)) {
  const source = sources.find((s) => s !== dest && fs.existsSync(s));
  if (!source) {
    console.error("Template source not found. Expected at:", dest);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
  console.log("Copied template to", dest);
} else {
  console.log("Template already present at", dest);
}

// Validate template has expected w:t structure
import PizZip from "pizzip";
const buf = fs.readFileSync(dest);
const zip = new PizZip(buf);
const xml = zip.file("word/document.xml")?.asText();
if (!xml) {
  console.error("Invalid template: missing word/document.xml");
  process.exit(1);
}
const count = (xml.match(/<w:t/g) ?? []).length;
console.log(`Template validated: ${count} w:t nodes`);
if (count < 90) {
  console.warn("Warning: fewer w:t nodes than expected (90+). Index-based filling may need review.");
}
