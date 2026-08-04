"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { DataTable } from "@/components/admin/data-table";
import { EntityFormModal } from "@/components/admin/entity-form-modal";
import type { AdminEntityConfig } from "@/lib/admin/entity-config";
import { useEntityCrud, type EntityItem } from "@/lib/admin/use-entity-crud";
import type { useReferenceData } from "@/lib/admin/use-reference-data";

interface EntityViewProps {
  entity: AdminEntityConfig;
  searchQuery: string;
  onUnauthorized: () => void;
  referenceData: ReturnType<typeof useReferenceData>;
  createRequestId: number;
}

export function EntityView({ entity, searchQuery, onUnauthorized, referenceData, createRequestId }: EntityViewProps) {
  const { items, loading, error, create, update, remove } = useEntityCrud(entity.key, onUnauthorized);
  const { refData, ensureLoaded } = referenceData;
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EntityItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EntityItem | null>(null);

  useEffect(() => {
    const keys = entity.fields.filter((f) => f.optionsFrom).map((f) => f.optionsFrom!);
    if (keys.length > 0) ensureLoaded(keys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity.key]);

  useEffect(() => {
    if (createRequestId > 0) {
      setEditingItem(null);
      setFormOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createRequestId]);

  const openEdit = (item: EntityItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const result = editingItem ? await update(editingItem.id, data) : await create(data);
    if (result.ok) {
      showToast(editingItem ? `${entity.singular} updated.` : `${entity.singular} added.`);
    }
    return result;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await remove(deleteTarget.id);
    if (result.ok) {
      showToast(`${entity.singular} deleted.`);
      setDeleteTarget(null);
    } else {
      showToast(result.error ?? "Could not delete this item.", "error");
    }
  };

  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm text-navy-soft">{entity.description}</p>

      {error && (
        <Alert variant="error" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </Alert>
      )}

      <DataTable
        entity={entity}
        items={items}
        loading={loading}
        refData={refData}
        searchQuery={searchQuery}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onCreateClick={() => {
          setEditingItem(null);
          setFormOpen(true);
        }}
      />

      <EntityFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        entity={entity}
        initialItem={editingItem}
        refData={refData}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete this ${entity.singular.toLowerCase()}?`}
        description={`This will permanently remove it from ${entity.label.toLowerCase()}.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
