import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import os from "os";

const templatePath = path.join(process.cwd(), "templates", "quotation-template-source.docx");
const buf = fs.readFileSync(templatePath);
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "quote-tour-"));
const zipPath = path.join(tmpDir, "template.zip");
fs.writeFileSync(zipPath, buf);
execFileSync("powershell", [
  "-NoProfile", "-Command",
  `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${path.join(tmpDir, "out").replace(/'/g, "''")}' -Force`,
], { stdio: "pipe" });

const xml = fs.readFileSync(path.join(tmpDir, "out", "word", "document.xml"), "utf8");
const tables = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g);
const t1 = tables[1];
const rows = t1.split("<w:tr").slice(1);

function cellCount(row) {
  return row.split("<w:tc").length - 1;
}

[5, 8, 11, 14].forEach((i) => {
  console.log(`row ${i}: cells=${cellCount(rows[i])}`);
});

console.log("\n--- row 14 snippet ---");
console.log(rows[14].slice(0, 800));
