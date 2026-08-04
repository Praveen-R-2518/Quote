import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, primaryAction, secondaryAction, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-1 px-6 py-14 text-center", className)}>
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        <Icon className="h-6 w-6" />
      </span>
      <p className="text-[15px] font-semibold text-navy">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm leading-relaxed text-navy-soft">{description}</p>}
      {(primaryAction || secondaryAction) && (
        <div className="mt-5 flex items-center gap-3">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
