"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LogOut, Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminEntityConfig } from "@/lib/admin/entity-config";

interface AdminTopbarProps {
  entity: AdminEntityConfig;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onLogout: () => void;
  onOpenMobileSidebar: () => void;
}

export function AdminTopbar({ entity, searchQuery, onSearchChange, onCreateClick, onLogout, onOpenMobileSidebar }: AdminTopbarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-stone-100 bg-white/90 px-4 py-3.5 backdrop-blur sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-soft transition-colors hover:bg-stone-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-stone-400">Admin</p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-navy">{entity.label}</h1>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2.5">
          {!entity.singleton && (
            <div className="relative hidden max-w-xs flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Search ${entity.label.toLowerCase()}…  (press /)`}
                aria-label={`Search ${entity.label.toLowerCase()}`}
                className="h-9 w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 text-sm text-navy placeholder:text-stone-400 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          )}

          {!entity.singleton && (
            <Button size="sm" onClick={onCreateClick} className="shrink-0">
              <Plus className="mr-1.5 h-4 w-4" />
              New {entity.singular}
            </Button>
          )}

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-navy-soft transition-colors hover:bg-stone-100 hover:text-navy"
            >
              Back to Builder
            </Link>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
