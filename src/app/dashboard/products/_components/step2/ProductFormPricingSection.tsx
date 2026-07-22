"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import { FormSectionCard } from "../ProductFormDecorators";
import { ProductFormHint } from "../ProductFormHint";
import { cn } from "@/utils/common.utils";
import type { SuperCategory } from "@/types/customer/customer.types";
import type { ProductFormValues } from "@/types/product/product.types";

interface ProductFormPricingSectionProps {
  supers: SuperCategory[];
  values: ProductFormValues;
  toggleSuperCategory: (superCategoryId: string, checked: boolean) => void;
  setSuperPrice: (superCategoryId: string, price: string) => void;
}

export function ProductFormPricingSection({
  supers,
  values,
  toggleSuperCategory,
  setSuperPrice,
}: ProductFormPricingSectionProps) {
  const [justToggledId, setJustToggledId] = useState<string | null>(null);

  const handlePriceChange = (id: string, val: string) => {
    // Only allow digits and one decimal point
    const sanitized = val?.replace(/[^0-9.]/g, "");
    const parts = sanitized?.split(".");
    const final =
      parts?.[0] + (parts?.length > 1 ? "." + parts?.slice(1)?.join("") : "");
    setSuperPrice(id, final);
  };

  return (
    <FormSectionCard
      title="Business Segments & Pricing"
      className="flex flex-col h-full">
      <ProductFormHint className="-mt-2 mb-2">
        Select segments and set a base price for each. One price per segment
        required.
      </ProductFormHint>

      {!supers?.length ? (
        <p className="text-sm text-amber-600">
          No segments loaded — check API seed.
        </p>
      ) : (
        <div className="space-y-2 flex-1">
          {supers?.map((sc) => {
            const row = values?.basePrices?.find(
              (b) => b?.superCategoryId === sc?._id,
            );
            const selected = Boolean(row);
            const price = row?.price ?? "";

            return (
              <div
                key={sc?._id}
                className={cn(
                  "group flex items-center gap-3 rounded-xl p-2 pr-3 transition-all border",
                  selected
                    ? "bg-white border-primary/20 shadow-sm ring-1 ring-primary/5 h-14"
                    : "bg-white/40 border-transparent hover:border-gray-200 hover:bg-white h-14",
                )}>
                <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer py-1.5 pl-1">
                  <div className="relative flex items-center justify-center">
                    <Checkbox
                      checked={selected}
                      onCheckedChange={(c) => {
                        const isChecked = Boolean(c);
                        if (isChecked) {
                          setJustToggledId(sc?._id);
                        } else if (justToggledId === sc?._id) {
                          setJustToggledId(null);
                        }
                        toggleSuperCategory(sc?._id, isChecked);
                      }}
                      className="h-5 w-5 rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      selected ? "text-gray-900" : "text-gray-500",
                    )}>
                    {sc?.name}
                  </span>
                </label>

                {selected && (
                  <div className="flex items-center gap-2 w-32 shrink-0 animate-in fade-in slide-in-from-right-1 duration-200">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/60">
                        ¥
                      </span>
                      <Input
                        type="text"
                        placeholder="0.00"
                        autoFocus={justToggledId === sc?._id}
                        className={cn(
                          "h-10 pl-6 text-sm font-medium shadow-none border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/30",
                          !price && "border-destructive/30 bg-destructive/5",
                        )}
                        value={price}
                        onChange={(e) =>
                          handlePriceChange(sc?._id, e.target.value)
                        }
                      />
                    </div>
                    {Number(price) > 0 && (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </FormSectionCard>
  );
}
