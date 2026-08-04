import fs from "fs";
import path from "path";
import { BRAND_LOGO_SRC } from "@/lib/brand";

/** Resolve company logo for PDF export (optional file on disk). */
export function resolveBrandLogoPath(logoPath?: string | null): string | null {
  const brandDir = path.join(process.cwd(), "public", "brand");
  const brandFiles = fs.existsSync(brandDir)
    ? fs.readdirSync(brandDir).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f))
    : [];

  const candidates = [
    logoPath,
    path.join(process.cwd(), "public", BRAND_LOGO_SRC.replace(/^\//, "")),
    ...brandFiles.map((f) => path.join(brandDir, f)),
    path.join(process.cwd(), "templates", "brand-logo.png"),
    path.join(process.cwd(), "templates", "brand-logo.jpg"),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const resolved = path.isAbsolute(candidate) ? candidate : path.join(process.cwd(), candidate);
    if (fs.existsSync(resolved)) return resolved;
  }

  return null;
}
