import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: "amber" | "blue" | "emerald" | "violet";
  trend?: { value: number; label?: string } | null;
  description?: string;
}

const colorConfig = {
  amber: {
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconText: "text-amber-600 dark:text-amber-400",
    border: "border-t-amber-500",
  },
  blue: {
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconText: "text-blue-600 dark:text-blue-400",
    border: "border-t-blue-500",
  },
  emerald: {
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconText: "text-emerald-600 dark:text-emerald-400",
    border: "border-t-emerald-500",
  },
  violet: {
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconText: "text-violet-600 dark:text-violet-400",
    border: "border-t-violet-500",
  },
};

export function StatsCard({ title, value, icon, color = "amber", trend, description }: StatsCardProps) {
  const c = colorConfig[color];

  return (
    <div className={cn("card-admin relative border-t-[3px] p-5", c.border)}>
      <div className={cn("absolute top-4 right-4 rounded-lg p-2.5", c.iconBg, c.iconText)}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div className="pr-12">
        <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
        <p className="mt-2 text-[26px] font-bold leading-none tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
          {value}
        </p>
        {trend && (
          <div className="mt-2 flex items-center gap-1.5">
            {trend.value > 0 ? (
              <span className="kpi-trend-up">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
                {Math.abs(trend.value)}%
              </span>
            ) : trend.value < 0 ? (
              <span className="kpi-trend-down">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
                {Math.abs(trend.value)}%
              </span>
            ) : (
              <span className="kpi-trend-neutral">0%</span>
            )}
            {trend.label && (
              <span className="text-[11px] text-zinc-400">{trend.label}</span>
            )}
          </div>
        )}
        {description && !trend && (
          <p className="mt-1.5 text-[11px] text-zinc-400">{description}</p>
        )}
      </div>
    </div>
  );
}
