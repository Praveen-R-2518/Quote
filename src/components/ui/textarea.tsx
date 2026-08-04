import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("flex min-h-[90px] w-full rounded-xl border border-orange-100 bg-white px-3.5 py-3 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:opacity-50", className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
