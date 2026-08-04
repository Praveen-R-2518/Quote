"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_ENTITIES, ADMIN_GROUPS, type AdminEntityConfig } from "@/lib/admin/entity-config";
import { APP_NAME, BRAND_LOGO_SRC, DEFAULT_COMPANY_NAME } from "@/lib/brand";

interface AdminSidebarProps {
  activeKey: string;
  onSelect: (entity: AdminEntityConfig) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
}

export function AdminSidebar({ activeKey, onSelect, collapsed, onToggleCollapsed, mobileOpen, onCloseMobile, onLogout }: AdminSidebarProps) {
  const [logoError, setLogoError] = useState(false);
  // The mobile drawer is always fully expanded regardless of the desktop
  // collapsed preference — only the persistent desktop rail collapses.
  const showLabels = !collapsed || mobileOpen;

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-navy/40 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col border-r border-stone-100 bg-white transition-[width,transform] duration-200 lg:sticky lg:top-0 lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          showLabels ? "w-64" : "w-[72px]"
        )}
      >
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 border-b border-stone-100 px-4 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
            !showLabels && "justify-center px-0"
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 ring-1 ring-stone-100">
            {!logoError ? (
              <Image
                src={BRAND_LOGO_SRC}
                alt={`${DEFAULT_COMPANY_NAME} logo`}
                width={32}
                height={32}
                className="h-full w-full object-contain"
                onError={() => setLogoError(true)}
                priority
              />
            ) : (
              <span className="text-xs font-bold text-orange-600">P</span>
            )}
          </span>
          {showLabels && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-navy">{APP_NAME}</span>
              <span className="block truncate text-[11px] font-medium text-navy-soft">Admin</span>
            </span>
          )}
        </Link>

        <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-2.5 py-4">
          {ADMIN_GROUPS.map((group) => {
            const entities = ADMIN_ENTITIES.filter((e) => e.group === group.key);
            if (entities.length === 0) return null;
            return (
              <div key={group.key} className="mb-5">
                {showLabels && (
                  <p className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {entities.map((entity) => {
                    const Icon = entity.icon;
                    const active = entity.key === activeKey;
                    return (
                      <li key={entity.key}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(entity);
                            onCloseMobile();
                          }}
                          title={!showLabels ? entity.label : undefined}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                            !showLabels && "justify-center px-0",
                            active ? "bg-orange-50 text-orange-700" : "text-navy-soft hover:bg-stone-50 hover:text-navy"
                          )}
                        >
                          <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-orange-600" : "text-stone-400")} />
                          {showLabels && <span className="truncate">{entity.label}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-stone-100 p-2.5 lg:hidden">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-navy-soft transition-colors hover:bg-stone-50 hover:text-navy"
          >
            Back to Builder
          </Link>
          {onLogout && (
            <button
              type="button"
              onClick={() => {
                onLogout();
                onCloseMobile();
              }}
              className="mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-navy-soft transition-colors hover:bg-stone-50 hover:text-navy"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>

        <div className="hidden border-t border-stone-100 p-2.5 lg:block">
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-navy-soft transition-colors hover:bg-stone-50 hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
              !showLabels && "justify-center px-0"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4 shrink-0" /> : <ChevronsLeft className="h-4 w-4 shrink-0" />}
            {showLabels && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
