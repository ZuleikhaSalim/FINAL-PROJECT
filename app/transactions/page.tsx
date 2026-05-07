import { createClient } from "@/lib/supabase/server";
import { TransactionsView } from "@/components/transactions-view";
import type { Sale, Period, GroupedSales } from "@/lib/types";

export const dynamic = "force-dynamic";

function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.ceil((diff / oneWeek) + 1);
}

function groupSalesByPeriod(sales: Sale[], period: Period): GroupedSales[] {
  const groups = new Map<string, Sale[]>();

  sales.forEach((sale) => {
    const date = new Date(sale.created_at);
    let key: string;

    switch (period) {
      case "day":
        key = date.toLocaleDateString("en-KE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        break;
      case "week":
        const weekNum = getWeekNumber(date);
        key = `Week ${weekNum} of ${date.getFullYear()}`;
        break;
      case "month":
        key = date.toLocaleDateString("en-KE", {
          year: "numeric",
          month: "long",
        });
        break;
      case "year":
        key = `Year ${date.getFullYear()}`;
        break;
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(sale);
  });

  return Array.from(groups.entries()).map(([label, groupSales]) => ({
    label,
    sales: groupSales,
    totalRevenue: groupSales.reduce((sum, s) => sum + s.total_price, 0),
    totalItems: groupSales.reduce((sum, s) => sum + s.quantity, 0),
  }));
}

async function getAllSales(period: Period): Promise<{
  groupedSales: GroupedSales[];
  totalRevenue: number;
  totalTransactions: number;
}> {
  const supabase = await createClient();

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "day":
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "month":
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "year":
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
  }

  const { data: sales, error } = await supabase
    .from("sales")
    .select("*")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sales:", error);
    return {
      groupedSales: [],
      totalRevenue: 0,
      totalTransactions: 0,
    };
  }

  const typedSales: Sale[] = (sales || []).map((s) => ({
    id: s.id,
    item_name: s.item_name,
    quantity: s.quantity,
    unit_price: Number(s.unit_price),
    total_price: Number(s.total_price),
    created_at: s.created_at,
  }));

  const groupedSales = groupSalesByPeriod(typedSales, period);
  const totalRevenue = typedSales.reduce((sum, s) => sum + s.total_price, 0);

  return {
    groupedSales,
    totalRevenue,
    totalTransactions: typedSales.length,
  };
}

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = (params.period as Period) || "day";

  const { groupedSales, totalRevenue, totalTransactions } = await getAllSales(period);

  return (
    <TransactionsView
      groupedSales={groupedSales}
      totalRevenue={totalRevenue}
      totalTransactions={totalTransactions}
      currentPeriod={period}
    />
  );
}
