import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warning" | "error" | "success";
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  const variants = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };
  return (
    <div className={cn("rounded-md border p-4 text-sm", variants[variant], className)} role="alert" {...props} />
  );
}
