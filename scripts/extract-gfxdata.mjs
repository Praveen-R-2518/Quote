import fs from "fs";
import path from "path";
import PizZip from "pizzip";

const original =
  "c:/Users/hp/Desktop/Personal Folders/pumpkin tours and travels/TEMPLATES/Quotation TEMPLATE.docx";
const zip = new PizZip(fs.readFileSync(original));
const xml = zip.file("word/document.xml").asText();

const gfx = [...xml.matchAll(/<o:gfxdata>([\s\S]*?)<\/o:gfxdata>/g)];
console.log("gfxdata blocks:", gfx.length);
for (let i = 0; i < gfx.length; i++) {
  const data = gfx[i][1];
  console.log(`block ${i} length`, data.length);
  const out = path.join(process.cwd(), "templates", `gfxdata-${i}.bin`);
  fs.writeFileSync(out, Buffer.from(data, "utf8"));
  console.log("written", out);
}

// Also dump first 200 bytes hex of docx for manual inspect
const header = Buffer.from(gfx[0]?.[1] ?? "", "utf8").slice(0, 16);
console.log("header hex", header.toString("hex"));
