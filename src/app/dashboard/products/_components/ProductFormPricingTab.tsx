"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/common.utils";
import { ProductFormHint } from "./ProductFormHint";

import { ProductFormPricingTabProps } from "./types/ProductFormPricingTab.types";

export function ProductFormPricingTab({
  supers,
  values,
  toggleSuperCategory,
  setSuperPrice,
}: ProductFormPricingTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-900">Business segments</p>
        <ProductFormHint>
          Choose which segments sell this product. Select at least one and set a
          base price (greater than zero) for each selected segment.
        </ProductFormHint>
      </div>

      {!supers?.length ? (
        <p className="text-sm text-amber-700">
          No super categories loaded. Check API / system seed.
        </p>
      ) : (
        <div className="space-y-2">
          {supers?.map((sc) => {
            const row = values.basePrices?.find(
              (b) => b?.superCategoryId === sc?._id,
            );
            const selected = Boolean(row);
            const price = row?.price ?? "";

            return (
              <div
                key={sc?._id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg px-4 py-3 border transition-colors",
                  selected
                    ? "border-l-4 border-primary bg-primary/5"
                    : "border border-gray-100 bg-white hover:bg-gray-50/60",
                )}>
                {/* Checkbox + name */}
                <label className="flex items-center gap-3 min-w-[180px] shrink-0 cursor-pointer">
                  <Checkbox
                    checked={selected}
                    onCheckedChange={(c) =>
                      toggleSuperCategory(sc?._id, Boolean(c))
                    }
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {sc?.name}
                  </span>
                </label>

                {/* Price input — only when selected */}
                {selected && (
                  <div className="flex items-center gap-2 sm:ml-auto max-w-[200px] w-full">
                    <span className="text-sm text-muted-foreground shrink-0">
                      ¥
                    </span>
                    <Input
                      type="text"
                      placeholder="0"
                      className="flex-1"
                      value={price}
                      onChange={(e) => setSuperPrice(sc?._id, e.target.value)}
                    />
                    {(!price || Number(price) <= 0) && (
                      <span className="text-xs text-destructive whitespace-nowrap">
                        Required
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
