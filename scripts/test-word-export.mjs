import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// Use compiled next output is hard; invoke filler logic inline via dynamic import from dist - skip

import PizZip from "pizzip";

const TEMPLATE_PATH = path.join(process.cwd(), "templates", "quotation-template-source.docx");
const zip = new PizZip(fs.readFileSync(TEMPLATE_PATH));
let xml = zip.file("word/document.xml").asText();

function findParagraphs(xmlStr) {
  const results = [];
  const regex = /<w:p[\s>][\s\S]*?<\/w:p>/g;
  let match;
  while ((match = regex.exec(xmlStr)) !== null) {
    results.push({ xml: match[0], index: match.index });
  }
  return results;
}

const paragraphs = findParagraphs(xml);
const hanuman = paragraphs.find((p) => p.xml.includes("Hanuman temple"));
const firstP = paragraphs[0];
console.log("first para length", firstP.xml.length);
console.log("hanuman para length", hanuman?.xml.length);
console.log("hanuman has table?", hanuman?.xml.includes("<w:tbl"));

const badMatch = xml.match(/<w:p[^>]*>[\s\S]*?Hanuman temple[\s\S]*?<\/w:p>/);
console.log("OLD regex match length", badMatch?.[0].length);
console.log("OLD regex had table?", badMatch?.[0].includes("<w:tbl"));
