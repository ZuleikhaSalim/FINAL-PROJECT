export interface Sale {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface DailySummary {
  date: string;
  total_sales: number;
  total_items: number;
  transaction_count: number;
}

export interface TopItem {
  item_name: string;
  total_quantity: number;
  total_revenue: number;
}

export type Period = "day" | "week" | "month" | "year";

export interface GroupedSales {
  label: string;
  sales: Sale[];
  totalRevenue: number;
  totalItems: number;
}
