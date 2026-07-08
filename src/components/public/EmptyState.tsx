import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 rounded-full bg-gray-100 p-5 dark:bg-gray-800">
        <svg className="h-14 w-14 text-[#8B6914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-[#3E2723] dark:text-[#F5EDE0]">{title}</h3>
      <p className="mt-2 text-sm text-[#4A3728] dark:text-gray-400 max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B6914] px-6 py-2.5 text-sm font-bold text-[#3E2723] shadow-lg shadow-[#8B6914]/20 transition-all duration-200 hover:bg-[#A0781A]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
