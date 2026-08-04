"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange, className, disabled, id, ...props }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-orange-500" : "bg-stone-200",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-[18px] w-[18px] translate-x-1 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked && "translate-x-[18px]"
        )}
      />
    </button>
  );
}
