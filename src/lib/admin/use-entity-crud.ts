"use client";

import { useCallback, useEffect, useState } from "react";
import type { EntityName } from "@/lib/config-service";

export type EntityItem = Record<string, unknown> & { id: number };

interface CrudResult {
  ok: boolean;
  error?: string;
}

interface UseEntityCrudReturn {
  items: EntityItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: Record<string, unknown>) => Promise<CrudResult>;
  update: (id: number, data: Record<string, unknown>) => Promise<CrudResult>;
  remove: (id: number) => Promise<CrudResult>;
}

export function useEntityCrud(entity: EntityName, onUnauthorized?: () => void): UseEntityCrudReturn {
  const [items, setItems] = useState<EntityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${entity}`);
      if (res.status === 401) {
        onUnauthorized?.();
        return;
      }
      if (!res.ok) throw new Error("Failed to load data.");
      const data = await res.json();
      setItems(Array.isArray(data) ? (data as EntityItem[]) : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [entity, onUnauthorized]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (data: Record<string, unknown>): Promise<CrudResult> => {
      try {
        const res = await fetch(`/api/admin/${entity}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) return { ok: false, error: "Could not create this item. Please check the fields and try again." };
        await refresh();
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error — please try again." };
      }
    },
    [entity, refresh]
  );

  const update = useCallback(
    async (id: number, data: Record<string, unknown>): Promise<CrudResult> => {
      try {
        const res = await fetch(`/api/admin/${entity}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...data }),
        });
        if (!res.ok) return { ok: false, error: "Could not save your changes. Please try again." };
        await refresh();
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error — please try again." };
      }
    },
    [entity, refresh]
  );

  const remove = useCallback(
    async (id: number): Promise<CrudResult> => {
      try {
        const res = await fetch(`/api/admin/${entity}?id=${id}`, { method: "DELETE" });
        if (!res.ok) return { ok: false, error: "Could not delete this item." };
        await refresh();
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error — please try again." };
      }
    },
    [entity, refresh]
  );

  return { items, loading, error, refresh, create, update, remove };
}
