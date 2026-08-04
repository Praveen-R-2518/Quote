import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import os from "os";
import { fillQuotationTemplate } from "../src/lib/export/template-filler.ts";

const sampleRows = Array.from({ length: 6 }, (_, i) => {
  const day = i + 1;
  const isLast = day === 6;
  return {
    dayLabel: `DAY ${String(day).padStart(2, "0")}`,
    from: day === 1 ? "AIRPORT" : `LOC${day - 1}`,
    to: isLast ? "AIRPORT" : `LOC${day}`,
    hotelName: isLast ? "DROP AT AIRPORT" : `Hotel ${day}`,
    stayLocation: isLast ? "" : `LOC${day}`,
    roomCategory: isLast ? "" : "DELUXE",
  };
});

const data = {
  nights: 5,
  days: 6,
  quotationDate: "04.08.2026",
  expirationDate: "04.09.2026",
  paxQtyLabel: "10pax",
  transportDescription: "Van",
  roomsDescription: "5 DBL",
  roomsQty: 5,
  packageDescription: "5N 6D Sri Lanka",
  formattedPrice: "50,000",
  formattedTotalPrice: "500,000",
  currencyCode: "INR",
  inclusions: ["Hanuman temple"],
  exclusions: [],
  tourPlanRows: sampleRows,
};

const buf = await fillQuotationTemplate(data);
const out = path.join(process.cwd(), "data", "test-export.docx");
fs.writeFileSync(out, buf);
console.log("Wrote", out, buf.length, "bytes");

// Compare tbl tags
function extractXml(docxPath) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "q-"));
  fs.writeFileSync(path.join(tmp, "t.zip"), fs.readFileSync(docxPath));
  execFileSync("powershell", ["-NoProfile", "-Command", `Expand-Archive -LiteralPath '${path.join(tmp, "t.zip").replace(/'/g, "''")}' -DestinationPath '${path.join(tmp, "o").replace(/'/g, "''")}' -Force`], { stdio: "pipe" });
  return fs.readFileSync(path.join(tmp, "o", "word", "document.xml"), "utf8");
}

const orig = extractXml("templates/quotation-template-source.docx");
const filled = extractXml(out);

const origTables = orig.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g);
const filledTables = filled.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g);

console.log("\nOriginal table 1 start:", origTables[1].slice(0, 500));
console.log("\nFilled table 1 start:", filledTables[1].slice(0, 500));
console.log("\nOriginal table 1 length:", origTables[1].length);
console.log("Filled table 1 length:", filledTables[1].length);

// Check if tblPr preserved
console.log("\nOrig has tblPr:", origTables[1].includes("<w:tblPr"));
console.log("Filled has tblPr:", filledTables[1].includes("<w:tblPr"));
console.log("Orig has tblGrid:", origTables[1].includes("<w:tblGrid"));
console.log("Filled has tblGrid:", filledTables[1].includes("<w:tblGrid"));
