"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { APP_NAME, BRAND_LOGO_SRC, DEFAULT_COMPANY_NAME } from "@/lib/brand";

interface SiteHeaderProps {
  companyName?: string | null;
}

export function SiteHeader({ companyName }: SiteHeaderProps) {
  const [logoError, setLogoError] = useState(false);
  const businessName = companyName?.trim() || DEFAULT_COMPANY_NAME;

  return (
    <header className="sticky top-4 z-30 mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white/70 px-3.5 py-2.5 shadow-[0_1px_2px_rgba(11,18,32,0.04),0_12px_32px_-12px_rgba(11,18,32,0.10)] backdrop-blur-xl sm:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 rounded-xl">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-[0_1px_2px_rgba(11,18,32,0.08)] ring-1 ring-black/[0.06]">
            {!logoError ? (
              <Image
                src={BRAND_LOGO_SRC}
                alt={`${businessName} logo`}
                width={36}
                height={36}
                className="h-full w-full object-contain"
                onError={() => setLogoError(true)}
                priority
              />
            ) : (
              <span className="text-sm font-bold text-orange-600">P</span>
            )}
          </span>
          <span className="truncate text-[15px] font-semibold tracking-tight text-navy">
            {APP_NAME}
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-black/[0.06] bg-cream px-3 py-1.5 text-xs font-medium text-navy-soft sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Internal Tool
          </span>
          <Link
            href="/admin"
            className="rounded-xl px-3 py-2 text-sm font-medium text-navy-soft transition-colors hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
