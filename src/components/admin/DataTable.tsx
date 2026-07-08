"use client";

import { ReactNode } from "react";
import { EmptyState } from "@/components/public/EmptyState";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyTitle = "Tidak ada data",
  emptyDescription = "Belum ada data yang tersedia.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-[#2C1810]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-[#1A120B]">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
