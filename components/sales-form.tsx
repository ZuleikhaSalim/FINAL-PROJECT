"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addSale } from "@/app/actions";

export function SalesForm({ onSuccess }: { onSuccess?: () => void }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  const totalPrice =
    quantity && unitPrice
      ? (parseFloat(quantity) * parseFloat(unitPrice))
      : 0;

  const formatCurrency = (value: number) => {
    return `Ksh ${value.toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await addSale({
        item_name: itemName,
        quantity: parseInt(quantity),
        unit_price: parseFloat(unitPrice),
      });

      if (result.success) {
        setItemName("");
        setQuantity("");
        setUnitPrice("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        onSuccess?.();
      }
    });
  };

  const isValid =
    itemName.trim() &&
    quantity &&
    parseFloat(quantity) > 0 &&
    unitPrice &&
    parseFloat(unitPrice) >= 0;

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Sale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="item_name" className="text-sm font-medium text-muted-foreground">
              Item Name
            </Label>
            <Input
              id="item_name"
              type="text"
              placeholder="e.g., Croissant, Bread loaf"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="h-12 text-base bg-secondary border-0 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-muted-foreground">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="1"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-12 text-base bg-secondary border-0 rounded-xl"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="unit_price" className="text-sm font-medium text-muted-foreground">
                Unit Price (Ksh)
              </Label>
              <Input
                id="unit_price"
                type="number"
                placeholder="0"
                min="0"
                step="1"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="h-12 text-base bg-secondary border-0 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-muted rounded-xl">
            <span className="text-sm font-medium text-muted-foreground">Total</span>
            <span className="text-xl font-bold text-foreground">{formatCurrency(totalPrice)}</span>
          </div>

          <Button
            type="submit"
            disabled={!isValid || isPending}
            className="h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-all"
          >
            {isPending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : showSuccess ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Saved
              </span>
            ) : (
              "Add Sale"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
