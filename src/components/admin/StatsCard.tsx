interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: "gold" | "blue" | "green" | "purple";
}

const colors = {
  gold: "bg-[#8B6914]/10 text-[#8B6914]",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
};

export function StatsCard({ title, value, icon, color = "gold" }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-[#2C1810]">
      <div className="flex items-center gap-4">
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0]">{value}</p>
        </div>
      </div>
    </div>
  );
}
