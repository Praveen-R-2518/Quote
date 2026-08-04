"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { APP_NAME, BRAND_LOGO_SRC, DEFAULT_COMPANY_NAME } from "@/lib/brand";

interface AppHeaderProps {
  companyName?: string | null;
  right?: React.ReactNode;
  showAdminLink?: boolean;
}

export function AppHeader({ companyName, right, showAdminLink = false }: AppHeaderProps) {
  const [logoError, setLogoError] = useState(false);
  const businessName = companyName?.trim() || DEFAULT_COMPANY_NAME;

  return (
    <header className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white/85 px-4 py-2.5 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-[0_1px_2px_rgba(124,45,18,0.08)] ring-1 ring-orange-100">
            {!logoError ? (
              <Image
                src={BRAND_LOGO_SRC}
                alt={`${businessName} logo`}
                width={40}
                height={40}
                className="h-full w-full object-contain"
                onError={() => setLogoError(true)}
                priority
              />
            ) : (
              <span className="text-sm font-bold text-orange-600">P</span>
            )}
          </div>
          <h1 className="truncate text-base font-semibold tracking-tight text-stone-900 sm:text-lg">
            {APP_NAME}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {right}
          {showAdminLink ? (
            <Link
              href="/admin"
              className="rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-orange-50 hover:text-orange-700"
            >
              Admin
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
