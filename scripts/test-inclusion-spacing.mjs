import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import os from "os";
import { fillQuotationTemplate } from "../src/lib/export/template-filler.ts";

const data = {
  nights: 3,
  days: 4,
  quotationDate: "04.08.2026",
  expirationDate: "04.09.2026",
  paxQtyLabel: "10pax",
  transportDescription: "Van",
  roomsDescription: "5 DBL",
  roomsQty: 5,
  packageDescription: "3N 4D",
  formattedPrice: "50,000",
  formattedTotalPrice: "500,000",
  currencyCode: "INR",
  inclusions: ["Hanuman temple", "Spice garden", "Tea factory"],
  exclusions: ["Lunch", "Dinner", "Tips"],
  tourPlanRows: [],
};

const buf = await fillQuotationTemplate(data);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "q-sp-"));
fs.writeFileSync(path.join(tmp, "t.zip"), buf);
execFileSync("powershell", ["-NoProfile", "-Command", `Expand-Archive -LiteralPath '${path.join(tmp, "t.zip").replace(/'/g, "''")}' -DestinationPath '${path.join(tmp, "o").replace(/'/g, "''")}' -Force`], { stdio: "pipe" });
const xml = fs.readFileSync(path.join(tmp, "o", "word", "document.xml"), "utf8");

const regex = /<w:p[\s>][\s\S]*?<\/w:p>/g;
const paragraphs = [];
let m;
while ((m = regex.exec(xml)) !== null) paragraphs.push(m[0]);

const start = paragraphs.findIndex((p) => p.includes("Entry Tickets Included"));
const footer = paragraphs.findIndex((p) => p.includes("Please feel free to reach out"));

console.log("Section paragraphs:");
for (let i = start; i <= footer; i++) {
  const texts = [...paragraphs[i].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((x) => x[1]);
  const spacing = paragraphs[i].match(/<w:spacing[^/]*\/>/)?.[0] ?? "";
  console.log(i, texts.length ? texts.join(" | ") : "(empty)", spacing ? `[${spacing}]` : "");
}

const spacers = paragraphs.slice(start, footer + 1).filter((p) => p.includes('w:before="360"'));
console.log("\nSpacer paragraphs with before=360:", spacers.length);
if (spacers.length < 2) {
  console.error("FAIL: expected at least 2 spacers (inclusions→exclusions, exclusions→footer)");
  process.exit(1);
}
console.log("OK");
