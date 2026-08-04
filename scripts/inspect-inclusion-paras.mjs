import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import os from "os";

const buf = fs.readFileSync("templates/quotation-template-source.docx");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "q-inc-"));
fs.writeFileSync(path.join(tmp, "t.zip"), buf);
execFileSync("powershell", ["-NoProfile", "-Command", `Expand-Archive -LiteralPath '${path.join(tmp, "t.zip").replace(/'/g, "''")}' -DestinationPath '${path.join(tmp, "o").replace(/'/g, "''")}' -Force`], { stdio: "pipe" });
const xml = fs.readFileSync(path.join(tmp, "o", "word", "document.xml"), "utf8");

const regex = /<w:p[\s>][\s\S]*?<\/w:p>/g;
const paragraphs = [];
let m;
while ((m = regex.exec(xml)) !== null) paragraphs.push({ index: m.index, xml: m[0] });

const start = paragraphs.findIndex((p) => p.xml.includes("Entry Tickets Included"));
const footer = paragraphs.findIndex((p) => p.xml.includes("Please feel free to reach out"));

console.log(`Paragraphs ${start} to ${footer}:`);
for (let i = start; i <= footer; i++) {
  const texts = [...paragraphs[i].xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((x) => x[1]);
  const isList = paragraphs[i].xml.includes("ListParagraph");
  const isEmpty = texts.length === 0;
  console.log(i, isList ? "LIST" : "PARA", isEmpty ? "(empty)" : texts.join(" | "));
}
