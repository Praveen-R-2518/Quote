import fs from "fs";
import path from "path";
import PizZip from "pizzip";

const templatePath = path.join(process.cwd(), "templates", "quotation-template-source.docx");
const zip = new PizZip(fs.readFileSync(templatePath));
const xml = zip.file("word/document.xml").asText();

const marker = "Entry Tickets Included";
const idx = xml.indexOf(marker);
console.log("Entry Tickets index:", idx);

const snippet = xml.slice(Math.max(0, idx - 400), idx + 1200);
console.log(snippet);

const tblEnds = [...xml.matchAll(/<\/w:tbl>/g)].map((m) => m.index);
const lastTblEnd = tblEnds.filter((e) => e < idx).pop();
console.log("\nLast </w:tbl> before inclusions:", lastTblEnd);
console.log("Inclusions inside table?", lastTblEnd !== undefined && idx > lastTblEnd ? "NO (after table)" : "MAYBE INSIDE");

// Check if inclusions paras are inside w:tc
const inclusionPara = xml.match(/<w:p[^>]*>[\s\S]*?Entry Tickets Included:[\s\S]*?<\/w:p>/);
const itemPara = xml.match(/<w:p[^>]*>[\s\S]*?Hanuman temple[\s\S]*?<\/w:p>/);
console.log("\nHeading para starts with w:tc?", inclusionPara?.[0].slice(0, 80));
console.log("Item para length:", itemPara?.[0].length);
console.log("Item para contains w:tbl?", itemPara?.[0].includes("<w:tbl"));
console.log("Item para contains w:tc?", itemPara?.[0].includes("<w:tc"));

// Logo / drawing
const drawingMatches = xml.match(/wp:docPr|pic:pic|v:shape|w:drawing/g);
console.log("\nDrawing elements:", drawingMatches?.length ?? 0);
