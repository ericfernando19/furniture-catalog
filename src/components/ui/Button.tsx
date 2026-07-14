"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
}

const variants = {
  primary:
    "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500/30 shadow-sm shadow-amber-600/20",
  secondary:
    "bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-500/30 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
  outline:
    "border border-zinc-200 text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-400/30 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 focus:ring-zinc-400/30 dark:text-zinc-400 dark:hover:bg-zinc-800",
};

const sizes = {
  sm: "px-3 py-1.5 text-[12px]",
  md: "px-3.5 py-2 text-[13px]",
  lg: "px-4 py-2.5 text-[13px]",
  xl: "px-5 py-3 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
