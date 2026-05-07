"use client";

import { SalesForm } from "./sales-form";
import { StatsCards } from "./stats-cards";
import { TopItems } from "./top-items";
import { RecentSales } from "./recent-sales";
import { PeriodToggle } from "./period-toggle";
import { useRouter } from "next/navigation";
import type { Sale, TopItem, Period } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface DashboardProps {
  sales: Sale[];
  topItems: TopItem[];
  totalRevenue: number;
  totalItems: number;
  transactionCount: number;
  currentPeriod: Period;
}

export function Dashboard({
  sales,
  topItems,
  totalRevenue,
  totalItems,
  transactionCount,
  currentPeriod,
}: DashboardProps) {
  const router = useRouter();

  const handleSaleSuccess = () => {
    router.refresh();
  };

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        backgroundImage: "url('/bakery-pattern.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen bg-background/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Main Container Box */}
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            {/* Header */}
            <header className="bg-gradient-to-r from-primary to-accent p-6">
              <div className="flex items-center justify-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-foreground/30 shadow-lg bg-card">
                  <Image
                    src="/chef-logo.jpg"
                    alt="Zuleikha's Bakery Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary-foreground tracking-wide">
                    ZULEIKHA'S BAKERY
                  </h1>
                  <p className="text-sm text-primary-foreground/80 font-light tracking-wider">
                    Sales Tracker
                  </p>
                </div>
              </div>
            </header>

            {/* Content Grid */}
            <div className="p-6">
              {/* Period Toggle & Stats Row */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <PeriodToggle currentPeriod={currentPeriod} />
                  <Link
                    href={`/transactions?period=${currentPeriod}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    See My Transactions
                  </Link>
                </div>
                <StatsCards
                  totalRevenue={totalRevenue}
                  totalItems={totalItems}
                  transactionCount={transactionCount}
                  period={currentPeriod}
                />
              </div>

              {/* Main Grid - 2 columns on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  <SalesForm onSuccess={handleSaleSuccess} />
                  <TopItems items={topItems} />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  <RecentSales sales={sales} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-muted/50 px-6 py-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {new Date().toLocaleDateString("en-KE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
