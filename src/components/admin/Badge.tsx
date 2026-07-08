"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "warning" | "danger";
  className?: string;
}

const variants = {
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  gold: "bg-[#8B6914]/10 text-[#8B6914]",
  success: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  warning: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  danger: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
