import { createClient } from "@/lib/supabase/server";
import { Dashboard } from "@/components/dashboard";
import type { Sale, TopItem, Period } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getSalesData(period: Period): Promise<{
  sales: Sale[];
  topItems: TopItem[];
  totalRevenue: number;
  totalItems: number;
  transactionCount: number;
}> {
  const supabase = await createClient();

  // Calculate start date based on period
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
      sales: [],
      topItems: [],
      totalRevenue: 0,
      totalItems: 0,
      transactionCount: 0,
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

  // Calculate totals
  const totalRevenue = typedSales.reduce((sum, s) => sum + s.total_price, 0);
  const totalItems = typedSales.reduce((sum, s) => sum + s.quantity, 0);
  const transactionCount = typedSales.length;

  // Calculate top items
  const itemMap = new Map<string, { quantity: number; revenue: number }>();
  typedSales.forEach((sale) => {
    const existing = itemMap.get(sale.item_name) || { quantity: 0, revenue: 0 };
    itemMap.set(sale.item_name, {
      quantity: existing.quantity + sale.quantity,
      revenue: existing.revenue + sale.total_price,
    });
  });

  const topItems: TopItem[] = Array.from(itemMap.entries())
    .map(([name, data]) => ({
      item_name: name,
      total_quantity: data.quantity,
      total_revenue: data.revenue,
    }))
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, 5);

  return {
    sales: typedSales,
    topItems,
    totalRevenue,
    totalItems,
    transactionCount,
  };
}

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = (params.period as Period) || "day";
  
  const { sales, topItems, totalRevenue, totalItems, transactionCount } =
    await getSalesData(period);

  return (
    <Dashboard
      sales={sales}
      topItems={topItems}
      totalRevenue={totalRevenue}
      totalItems={totalItems}
      transactionCount={transactionCount}
      currentPeriod={period}
    />
  );
}
