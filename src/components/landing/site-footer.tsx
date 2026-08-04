import Link from "next/link";
import { APP_NAME, DEFAULT_COMPANY_NAME } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
      <div className="flex flex-col items-center gap-3 border-t border-black/[0.06] pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-navy-soft/80">
          © {new Date().getFullYear()} {DEFAULT_COMPANY_NAME} · {APP_NAME} is an internal tool.
        </p>
        <Link
          href="/admin"
          className="text-xs font-medium text-navy-soft transition-colors hover:text-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
        >
          Admin settings
        </Link>
      </div>
    </footer>
  );
}
