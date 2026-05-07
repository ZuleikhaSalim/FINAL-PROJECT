"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Period } from "@/lib/types";

interface PeriodToggleProps {
  currentPeriod: Period;
}

export function PeriodToggle({ currentPeriod }: PeriodToggleProps) {
  const router = useRouter();
  const pathname = usePathname();

  const periods = [
    { key: "day", label: "Today" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
  ] as const;

  const handlePeriodChange = (period: Period) => {
    const basePath = pathname === "/transactions" ? "/transactions" : "/";
    router.push(`${basePath}?period=${period}`);
  };

  return (
    <div className="inline-flex items-center bg-muted rounded-xl p-1">
      {periods.map((period) => (
        <button
          key={period.key}
          onClick={() => handlePeriodChange(period.key)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            currentPeriod === period.key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
