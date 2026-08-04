"use client";

import { useCallback, useState } from "react";
import type { EntityName } from "@/lib/config-service";
import type { EntityItem } from "./use-entity-crud";

/**
 * Lazily fetches and caches lookup data for entities referenced by
 * `optionsFrom` in the admin field config (e.g. transport rules need the
 * vehicles list to resolve/select a vehicle name).
 */
export function useReferenceData() {
  const [refData, setRefData] = useState<Record<string, EntityItem[]>>({});

  const ensureLoaded = useCallback(async (keys: EntityName[]) => {
    const missing = keys.filter((k) => !(k in refData));
    if (missing.length === 0) return;
    const results = await Promise.all(
      missing.map(async (key): Promise<[EntityName, EntityItem[]]> => {
        const res = await fetch(`/api/admin/${key}`);
        if (!res.ok) return [key, []];
        const data = await res.json();
        return [key, Array.isArray(data) ? data : []];
      })
    );
    setRefData((prev) => {
      const next = { ...prev };
      for (const [key, data] of results) next[key] = data;
      return next;
    });
  }, [refData]);

  return { refData, ensureLoaded };
}
