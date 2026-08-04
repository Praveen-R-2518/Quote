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
  passengers: { adults: 10, children: 0, infants: 0 },
  roomAllocations: [],
  transport: [],
  hotels: [],
};

const buf = await fillQuotationTemplate(data);
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "quote-test-"));
const outPath = path.join(tmpDir, "test.docx");
fs.writeFileSync(outPath, buf);

const zipPath = path.join(tmpDir, "t.zip");
fs.copyFileSync(outPath, zipPath);
execFileSync("powershell", [
  "-NoProfile",
  "-Command",
  `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${path.join(tmpDir, "out").replace(/'/g, "''")}' -Force`,
], { stdio: "pipe" });

const xml = fs.readFileSync(path.join(tmpDir, "out", "word", "document.xml"), "utf8");
const tables = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g);
const t1 = tables[1];
const rows = t1.split("<w:tr").slice(1);
const dataRows = rows
  .map((r, i) => ({ i, texts: [...r.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]) }))
  .filter((r) => r.texts.length > 0 && /^DAY \d/.test(r.texts[0]));

console.log("Data rows found:", dataRows.length);
dataRows.forEach((r) => console.log(`  row ${r.i}:`, r.texts));

if (dataRows.length !== 6) {
  console.error("FAIL: expected 6 data rows");
  process.exit(1);
}
if (!dataRows.some((r) => r.texts[0] === "DAY 05")) {
  console.error("FAIL: DAY 05 missing");
  process.exit(1);
}
if (!dataRows.some((r) => r.texts[0] === "DAY 06")) {
  console.error("FAIL: DAY 06 missing");
  process.exit(1);
}
console.log("OK");
