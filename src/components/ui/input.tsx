import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("flex h-11 w-full rounded-xl border border-orange-100 bg-white px-3.5 py-2 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:opacity-50", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";
