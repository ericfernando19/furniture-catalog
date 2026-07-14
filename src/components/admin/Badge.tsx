"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "warning" | "danger";
  className?: string;
}

const variants = {
  default: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  gold: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  danger: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
