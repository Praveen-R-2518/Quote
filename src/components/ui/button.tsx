import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-orange-500 text-white shadow-sm hover:bg-orange-600 hover:shadow-md",
      outline: "border border-orange-200 bg-white text-stone-800 shadow-sm hover:border-orange-300 hover:bg-orange-50",
      ghost: "text-stone-600 hover:bg-orange-50 hover:text-orange-700",
      destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
    };
    const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };
    return (
      <button
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
