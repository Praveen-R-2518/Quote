"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { EntityView } from "@/components/admin/entity-view";
import { SettingsPanel } from "@/components/admin/settings-panel";
import { ADMIN_ENTITIES, type AdminEntityConfig } from "@/lib/admin/entity-config";
import { useReferenceData } from "@/lib/admin/use-reference-data";

interface AdminShellProps {
  onUnauthorized: () => void;
  onLogout: () => void;
}

export function AdminShell({ onUnauthorized, onLogout }: AdminShellProps) {
  const [activeEntity, setActiveEntity] = useState<AdminEntityConfig>(ADMIN_ENTITIES[0]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("admin-sidebar-collapsed") === "1");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [createRequestId, setCreateRequestId] = useState(0);
  const referenceData = useReferenceData();

  const selectEntity = (entity: AdminEntityConfig) => {
    setActiveEntity(entity);
    setSearchQuery("");
  };

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar
        activeKey={activeEntity.key}
        onSelect={selectEntity}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="admin-surface flex min-h-screen flex-1 flex-col">
        <AdminTopbar
          entity={activeEntity}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateClick={() => setCreateRequestId((id) => id + 1)}
          onLogout={onLogout}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {activeEntity.singleton ? (
              <SettingsPanel entity={activeEntity} onUnauthorized={onUnauthorized} />
            ) : (
              <EntityView
                entity={activeEntity}
                searchQuery={searchQuery}
                onUnauthorized={onUnauthorized}
                referenceData={referenceData}
                createRequestId={createRequestId}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
