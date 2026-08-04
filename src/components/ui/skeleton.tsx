import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-skeleton rounded-md bg-stone-200/70", className)}
      {...props}
    />
  );
}
