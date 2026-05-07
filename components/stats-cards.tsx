import { Card, CardContent } from "@/components/ui/card";
import type { Period } from "@/lib/types";

interface StatsCardsProps {
  totalRevenue: number;
  totalItems: number;
  transactionCount: number;
  period: Period;
}

const periodLabels: Record<Period, string> = {
  day: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

export function StatsCards({
  totalRevenue,
  totalItems,
  transactionCount,
  period,
}: StatsCardsProps) {
  const formatCurrency = (value: number) => {
    return `Ksh ${value.toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const stats = [
    {
      label: `${periodLabels[period]}'s Revenue`,
      value: formatCurrency(totalRevenue),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Items Sold",
      value: totalItems.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Transactions",
      value: transactionCount.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
      ),
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border border-border shadow-sm">
          <CardContent className="p-4 flex flex-col items-center gap-3">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-foreground text-center">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground text-center leading-tight">
              {stat.label}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
