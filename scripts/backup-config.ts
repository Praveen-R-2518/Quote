import fs from "fs";
import path from "path";

const dbPath = process.env.DATABASE_URL?.replace(/^file:/, "") ?? path.join(process.cwd(), "data", "quote.db");
const backupDir = path.join(process.cwd(), "data", "backups");

if (!fs.existsSync(dbPath)) {
  console.error("Database not found:", dbPath);
  process.exit(1);
}

if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = path.join(backupDir, `quote-${timestamp}.db`);
fs.copyFileSync(dbPath, backupPath);
console.log("Backup created:", backupPath);
