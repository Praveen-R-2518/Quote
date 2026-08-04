import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warning" | "error" | "success";
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  const variants = {
    default: "bg-orange-50 border-orange-200 text-orange-900",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-orange-50 border-orange-200 text-orange-900",
  };
  return (
    <div className={cn("rounded-2xl border p-4 text-sm shadow-sm", variants[variant], className)} role="alert" {...props} />
  );
}
