"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/common.utils";
import { ProductFormHint } from "./ProductFormHint";
import { Layers, CheckCircle2 } from "lucide-react";
import { ProductFormPricingCatalogTabProps } from "./types/ProductFormPricingCatalogTab.types";

export function ProductFormPricingCatalogTab({
  supers,
  values,
  setValues,
  categories,
  subcategories,
  manufacturers,
  toggleSuperCategory,
  setSuperPrice,
}: ProductFormPricingCatalogTabProps) {
  const handlePriceChange = (id: string, val: string) => {
    // Only allow digits and one decimal point
    const sanitized = val?.replace(/[^0-9.]/g, "");
    const parts = sanitized?.split(".");
    const final =
      parts?.[0] + (parts?.length > 1 ? "." + parts?.slice(1)?.join("") : "");
    setSuperPrice(id, final);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 px-6">
      {/* ── LEFT: Pricing / Business segments ── */}
      <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 flex flex-col h-full">
        <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Business Segments & Pricing
          </h3>
        </div>

        <ProductFormHint className="mb-4">
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
                        onCheckedChange={(c) =>
                          toggleSuperCategory(sc?._id, Boolean(c))
                        }
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
      </div>

      {/* ── RIGHT: Catalog (category / subcategory / manufacturer) ── */}
      <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3 mb-1">
          <Layers className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800">
            Catalog Classification
          </h3>
        </div>

        <div className="space-y-4 max-w-md">
          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={values.categoryId || ""}
              onValueChange={(categoryId) =>
                setValues((p) => ({ ...p, categoryId, subcategoryId: "" }))
              }>
              <SelectTrigger className="w-full bg-white shadow-none border-gray-200 h-10">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((c) => (
                  <SelectItem key={c?._id} value={c?._id}>
                    {c?.name?.en ?? c?._id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Subcategory
            </Label>
            <Select
              value={values.subcategoryId || ""}
              onValueChange={(subcategoryId) =>
                setValues((p) => ({ ...p, subcategoryId }))
              }
              disabled={!values.categoryId || subcategories?.length === 0}>
              <SelectTrigger className="w-full bg-white shadow-none border-gray-200 h-10">
                <SelectValue
                  placeholder={
                    !values.categoryId
                      ? "Select a category first"
                      : subcategories.length === 0
                        ? "No subcategories found"
                        : "Select subcategory"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {subcategories?.map((c) => (
                  <SelectItem key={c?._id} value={c?._id}>
                    {c?.name?.en ?? c?._id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!values.categoryId ? (
              <ProductFormHint>
                Choose a category to see options.
              </ProductFormHint>
            ) : subcategories?.length === 0 ? (
              <ProductFormHint>
                Product will be filed under parent category.
              </ProductFormHint>
            ) : null}
          </div>

          {/* Manufacturer */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Manufacturer / Brand <span className="text-destructive">*</span>
            </Label>
            <Select
              value={values.manufacturerId || ""}
              onValueChange={(manufacturerId) =>
                setValues((p) => ({ ...p, manufacturerId }))
              }>
              <SelectTrigger className="w-full bg-white shadow-none border-gray-200 h-10">
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers?.map((m) => (
                  <SelectItem key={m?._id} value={m?._id}>
                    {m?.name?.en ?? m?._id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ProductFormHint>Required for catalog filtering.</ProductFormHint>
          </div>
        </div>
      </div>
    </div>
  );
}
