"use client";

import { PeriodToggle } from "./period-toggle";
import type { Period, GroupedSales } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface TransactionsViewProps {
  groupedSales: GroupedSales[];
  totalRevenue: number;
  totalTransactions: number;
  currentPeriod: Period;
}

export function TransactionsView({
  groupedSales,
  totalRevenue,
  totalTransactions,
  currentPeriod,
}: TransactionsViewProps) {
  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-KE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPeriodLabel = () => {
    switch (currentPeriod) {
      case "day":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "year":
        return "This Year";
    }
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Main Container Box */}
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            {/* Header */}
            <header className="bg-gradient-to-r from-primary to-accent p-6">
              <div className="flex items-center justify-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary-foreground/30 shadow-lg bg-card">
                  <Image
                    src="/chef-logo.jpg"
                    alt="Zuleikha's Bakery Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <h1 className="text-xl md:text-2xl font-serif font-bold text-primary-foreground tracking-wide">
                    ZULEIKHA'S BAKERY
                  </h1>
                  <p className="text-sm text-primary-foreground/80 font-light tracking-wider">
                    Transaction Statement
                  </p>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="p-6">
              {/* Navigation & Toggle */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Dashboard
                </Link>
                <PeriodToggle currentPeriod={currentPeriod} />
              </div>

              {/* Summary Card */}
              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {getPeriodLabel()} Summary
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalTransactions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grouped Transactions */}
              {groupedSales.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto w-16 h-16 text-muted-foreground/50 mb-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-muted-foreground">
                    No transactions found for this period
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedSales.map((group, index) => (
                    <div
                      key={index}
                      className="bg-background rounded-xl border border-border overflow-hidden"
                    >
                      {/* Group Header */}
                      <div className="bg-muted/30 px-4 py-3 border-b border-border">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">
                            {group.label}
                          </h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              {group.sales.length} sales
                            </span>
                            <span className="font-medium text-accent">
                              {formatCurrency(group.totalRevenue)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Transactions List */}
                      <div className="divide-y divide-border">
                        {group.sales.map((sale) => (
                          <div
                            key={sale.id}
                            className="px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="text-primary"
                                >
                                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                  <line x1="3" y1="6" x2="21" y2="6" />
                                  <path d="M16 10a4 4 0 01-8 0" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {sale.item_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {sale.quantity} x {formatCurrency(sale.unit_price)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                {formatCurrency(sale.total_price)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatTime(sale.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="bg-muted/50 px-6 py-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Statement generated on{" "}
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
