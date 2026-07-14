"use client";

interface ChartData {
  label: string;
  value: number;
}

interface AdminChartProps {
  data: ChartData[];
  title: string;
  subtitle?: string;
}

export function AdminChart({ data, title, subtitle }: AdminChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="card-admin p-5">
      <div className="mb-5">
        <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[11px] text-zinc-400">{subtitle}</p>}
      </div>
      <div className="flex items-end gap-1.5" style={{ height: 140 }}>
        {data.map((d, i) => {
          const height = maxValue > 0 ? (d.value / maxValue) * 100 : 0;
          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center gap-1">
              <div className="absolute -top-8 z-10 hidden rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg group-hover:block dark:bg-zinc-700">
                {d.value.toLocaleString("id-ID")}
              </div>
              <div className="w-full" style={{ height: `${Math.max(height, 4)}%` }}>
                <div
                  className="w-full rounded-t-sm bg-amber-400 transition-all duration-300 group-hover:bg-amber-500 dark:bg-amber-500 dark:group-hover:bg-amber-400"
                  style={{ height: "100%" }}
                />
              </div>
              <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
