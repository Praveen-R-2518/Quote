import fs from "fs";
import path from "path";
import { fillQuotationTemplate } from "../src/lib/export/template-filler.ts";
import { convertDocxBufferToPdf } from "../src/lib/export/docx-to-pdf.ts";

const sampleRows = Array.from({ length: 6 }, (_, i) => {
  const day = i + 1;
  const isLast = day === 6;
  return {
    dayLabel: `DAY ${String(day).padStart(2, "0")}`,
    from: day === 1 ? "AIRPORT" : `SIGIRIYA`,
    to: isLast ? "AIRPORT" : `KANDY`,
    hotelName: isLast ? "DROP AT AIRPORT" : `Hotel ${day}`,
    stayLocation: isLast ? "" : `KANDY`,
    roomCategory: isLast ? "" : "DELUXE",
  };
});

const data = {
  nights: 5,
  days: 6,
  quotationDate: "04.08.2026",
  expirationDate: "04.09.2026",
  paxQtyLabel: "10pax",
  transportDescription: "Private van",
  roomsDescription: "5 DBL",
  roomsQty: 5,
  packageDescription: "5N 6D Sri Lanka",
  formattedPrice: "50,000",
  formattedTotalPrice: "500,000",
  currencyCode: "INR",
  inclusions: ["Hanuman temple tuktuk charges", "Spice garden entry ticket"],
  exclusions: ["Lunch and dinner"],
  tourPlanRows: sampleRows,
};

console.log("Generating DOCX...");
const docx = await fillQuotationTemplate(data);
fs.writeFileSync(path.join(process.cwd(), "data", "test-export.docx"), docx);

console.log("Converting to PDF via Word...");
const pdf = await convertDocxBufferToPdf(docx);
fs.writeFileSync(path.join(process.cwd(), "data", "test-export.pdf"), pdf);
console.log("OK — PDF size:", pdf.length, "bytes");
