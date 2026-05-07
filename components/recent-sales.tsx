"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Sale } from "@/lib/types";
import { deleteSale } from "@/app/actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface RecentSalesProps {
  sales: Sale[];
}

const formatCurrency = (value: number) => {
  return `Ksh ${value.toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export function RecentSales({ sales }: RecentSalesProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteSale(id);
      router.refresh();
    });
  };

  if (sales.length === 0) {
    return (
      <Card className="border border-border shadow-sm h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Recent Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Add your first sale to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-KE", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-KE", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="border border-border shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Recent Sales
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {sales.slice(0, 15).map((sale) => (
          <div
            key={sale.id}
            className="flex items-center justify-between py-3 px-3 bg-secondary/50 rounded-xl group hover:bg-secondary transition-colors"
          >
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="text-sm font-medium text-foreground truncate">
                {sale.item_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {sale.quantity} x {formatCurrency(sale.unit_price)} | {formatDate(sale.created_at)} {formatTime(sale.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(sale.total_price)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(sale.id)}
                disabled={isPending}
                aria-label={`Delete ${sale.item_name}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
