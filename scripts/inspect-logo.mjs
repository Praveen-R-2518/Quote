import fs from "fs";
import path from "path";
import PizZip from "pizzip";

const templatePath = path.join(process.cwd(), "templates", "quotation-template-source.docx");
const zip = new PizZip(fs.readFileSync(templatePath));
const xml = zip.file("word/document.xml").asText();

console.log("All files in docx:");
for (const name of Object.keys(zip.files).sort()) {
  if (!name.endsWith("/")) console.log(name, zip.files[name]._data?.uncompressedSize ?? "?");
}

const rels = zip.file("word/_rels/document.xml.rels")?.asText() ?? "";
console.log("\nDocument rels:\n", rels.slice(0, 2000));

const imgRefs = [...xml.matchAll(/r:embed="([^"]+)"/g)].map((m) => m[1]);
console.log("\nEmbed refs in document:", imgRefs);

for (const id of imgRefs) {
  const rel = rels.match(new RegExp(`Id="${id}"[^>]*Target="([^"]+)"`));
  if (rel) console.log(id, "->", rel[1]);
}
