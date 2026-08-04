"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Inbox, Pencil, SearchX, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  formatCellValue,
  getTableColumns,
  type AdminEntityConfig,
} from "@/lib/admin/entity-config";
import type { EntityItem } from "@/lib/admin/use-entity-crud";

const PAGE_SIZE = 8;

interface DataTableProps {
  entity: AdminEntityConfig;
  items: EntityItem[];
  loading: boolean;
  refData: Record<string, EntityItem[]>;
  searchQuery: string;
  onEdit: (item: EntityItem) => void;
  onDelete: (item: EntityItem) => void;
  onCreateClick: () => void;
}

type SortDirection = "asc" | "desc" | null;

export function DataTable({ entity, items, loading, refData, searchQuery, onEdit, onDelete, onCreateClick }: DataTableProps) {
  const columns = useMemo(() => getTableColumns(entity), [entity]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [page, setPage] = useState(0);

  const searchKeys = entity.searchKeys ?? columns.filter((c) => c.type === "text").map((c) => c.key);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      searchKeys.some((key) => String(item[key] ?? "").toLowerCase().includes(q))
    );
  }, [items, searchQuery, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      let cmp = 0;
      if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      else cmp = String(av ?? "").localeCompare(String(bv ?? ""));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const paged = sorted.slice(clampedPage * PAGE_SIZE, clampedPage * PAGE_SIZE + PAGE_SIZE);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
    setPage(0);
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-stone-100 bg-white">
        <div className="divide-y divide-stone-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              {columns.map((c) => (
                <Skeleton key={c.key} className="h-4 flex-1" />
              ))}
              <Skeleton className="h-7 w-16 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-stone-100 bg-white">
        <EmptyState
          icon={Inbox}
          title={`No ${entity.label.toLowerCase()} yet`}
          description={`Get started by adding your first ${entity.singular.toLowerCase()}.`}
          primaryAction={<Button onClick={onCreateClick}>Add {entity.singular}</Button>}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-100 bg-white">
      <div className="max-h-[60vh] overflow-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-stone-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="px-3 py-2.5 font-medium text-navy-soft sm:px-5 sm:py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-soft transition-colors hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-30" />
                    )}
                  </button>
                </th>
              ))}
              <th scope="col" className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-navy-soft sm:px-5 sm:py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <EmptyState
                    icon={SearchX}
                    title="No matches found"
                    description="Try a different search term."
                  />
                </td>
              </tr>
            ) : (
              paged.map((item) => (
                <tr key={item.id} className="group transition-colors hover:bg-orange-50/40">
                  {columns.map((col) => {
                    const { text, muted } = formatCellValue(col, item[col.key], refData);
                    return (
          <td key={col.key} className="px-3 py-3 text-navy sm:px-5 sm:py-3.5">
                        {col.type === "boolean" ? (
                          <Badge variant={item[col.key] ? "success" : "neutral"}>{text}</Badge>
                        ) : (
                          <span className={cn(muted && "text-stone-400", col.type === "textarea" && "line-clamp-1 max-w-xs")}>
                            {text}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-right sm:px-5 sm:py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        aria-label={`Edit ${entity.singular}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        aria-label={`Delete ${entity.singular}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex flex-col gap-3 border-t border-stone-100 px-4 py-3 text-sm text-navy-soft sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span>
            Page {clampedPage + 1} of {pageCount} · {sorted.length} {sorted.length === 1 ? "item" : "items"}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={clampedPage === 0}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={clampedPage >= pageCount - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
