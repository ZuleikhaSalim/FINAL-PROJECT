"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface SaleInput {
  item_name: string;
  quantity: number;
  unit_price: number;
}

export async function addSale(data: SaleInput) {
  const supabase = await createClient();

  const { error } = await supabase.from("sales").insert({
    item_name: data.item_name,
    quantity: data.quantity,
    unit_price: data.unit_price,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteSale(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("sales").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
