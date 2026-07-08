"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-[#4A3728] dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#3E2723] shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#8B6914] focus:outline-none focus:ring-2 focus:ring-[#8B6914]/20 dark:border-gray-700 dark:bg-[#2C1810] dark:text-[#F5EDE0] dark:placeholder:text-gray-500 dark:focus:border-[#8B6914]",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
