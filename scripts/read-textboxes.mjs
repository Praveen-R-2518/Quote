import fs from "fs";
import PizZip from "pizzip";

const x = new PizZip(fs.readFileSync("templates/quotation-template-source.docx"))
  .file("word/document.xml")
  .asText();
const drawings = [...x.matchAll(/<w:drawing>[\s\S]*?<\/w:drawing>/g)];
drawings.forEach((d, i) => {
  const texts = [...d[0].matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1]);
  console.log(`drawing ${i}:`, texts.join(""));
});
