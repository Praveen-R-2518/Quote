import fs from "fs";
import path from "path";
import PizZip from "pizzip";

const templatePath = path.join(process.cwd(), "templates", "quotation-template-source.docx");
const zip = new PizZip(fs.readFileSync(templatePath));
const xml = zip.file("word/document.xml").asText();

// Find all drawing / pict sections
const chunks = [
  ...xml.matchAll(/<w:drawing>[\s\S]*?<\/w:drawing>/g),
  ...xml.matchAll(/<w:pict>[\s\S]*?<\/w:pict>/g),
];

console.log("drawing chunks:", chunks.length);
chunks.slice(0, 3).forEach((m, i) => {
  console.log(`\n--- chunk ${i} len ${m[0].length} ---`);
  console.log(m[0].slice(0, 800));
});

// Search for base64 or image types
for (const pattern of ["png", "jpeg", "jpg", "image", "blip", "a:graphic"]) {
  console.log(pattern, xml.toLowerCase().includes(pattern));
}
