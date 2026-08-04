import fs from "fs";
import path from "path";

/** Resolve company logo for PDF export (optional file on disk). */
export function resolveBrandLogoPath(logoPath?: string | null): string | null {
  const candidates = [
    logoPath,
    path.join(process.cwd(), "public", "brand", "pumpkin-logo.png"),
    path.join(process.cwd(), "public", "brand", "pumpkin-logo.jpg"),
    path.join(process.cwd(), "templates", "brand-logo.png"),
    path.join(process.cwd(), "templates", "brand-logo.jpg"),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const resolved = path.isAbsolute(candidate) ? candidate : path.join(process.cwd(), candidate);
    if (fs.existsSync(resolved)) return resolved;
  }

  return null;
}
