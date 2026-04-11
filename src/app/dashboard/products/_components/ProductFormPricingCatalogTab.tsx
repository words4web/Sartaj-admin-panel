"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/common.utils";
import { ProductFormHint } from "./ProductFormHint";
import { Layers, CheckCircle2 } from "lucide-react";
import { ProductFormPricingCatalogTabProps } from "./types/ProductFormPricingCatalogTab.types";
import { FormSectionCard } from "./ProductFormDecorators";
import { Label } from "@/components/ui/label";
import { PaginatedDropdown } from "@/components/common/PaginatedDropdown";
import { categoryApi } from "@/services/category/category.api";
import { manufacturerApi } from "@/services/manufacturer/manufacturer.api";

export function ProductFormPricingCatalogTab({
  supers,
  values,
  setValues,
  hasSubcategories,
  setHasSubcategories,
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
      </FormSectionCard>

      {/* ── RIGHT: Catalog (category / subcategory / manufacturer) ── */}
      <FormSectionCard title="Catalog Classification" icon={Layers}>
        <div className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Category <span className="text-destructive">*</span>
            </Label>
            <PaginatedDropdown
              value={values.categoryId}
              selectedLabel={values.categoryLabel}
              onValueChange={(categoryId) => {
                setValues((p) => ({
                  ...p,
                  categoryId,
                  subcategoryId: "",
                  categoryLabel: undefined,
                  subcategoryLabel: undefined,
                }));
                setHasSubcategories(null);
              }}
              queryKey={["categories", "product-form"]}
              fetchData={async ({ search, page, limit }) => {
                const res = await categoryApi.getCategories({
                  search,
                  page,
                  limit,
                });
                return {
                  options: res?.categories?.map((c) => ({
                    value: c?._id,
                    label: c?.name?.en || c?._id,
                  })),
                  hasMore: res?.categories?.length === limit,
                };
              }}
              placeholder="Select a category"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Subcategory
            </Label>
            <PaginatedDropdown
              value={values.subcategoryId}
              selectedLabel={values.subcategoryLabel}
              onValueChange={(subcategoryId) =>
                setValues((p) => ({
                  ...p,
                  subcategoryId,
                  subcategoryLabel: undefined,
                }))
              }
              disabled={!values.categoryId || hasSubcategories === false}
              queryKey={["categories", "subcategories", values.categoryId]}
              fetchData={async ({ search }) => {
                const res = await categoryApi.getSubcategoriesByCategory(
                  values.categoryId,
                );

                // If it doesn't natively search via API, we can do a simple client-side search slice
                const filtered = search
                  ? res?.filter((c) =>
                      c?.name?.en
                        ?.toLowerCase()
                        ?.includes(search?.toLowerCase()),
                    )
                  : res;

                return {
                  options: filtered?.map((c) => ({
                    value: c?._id,
                    label: c?.name?.en || c?._id,
                  })),
                  hasMore: false, // getSubcategoriesByCategory returns all flatly
                };
              }}
              onItemsLoaded={(total) => setHasSubcategories(total > 0)}
              placeholder={
                !values.categoryId
                  ? "Select a category first"
                  : hasSubcategories === false
                    ? "No subcategories found"
                    : "Select subcategory"
              }
            />
            {(!values.categoryId || hasSubcategories === false) && (
              <ProductFormHint>
                {!values.categoryId
                  ? "Choose a category to see options."
                  : "Product will be filed under parent category."}
              </ProductFormHint>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Manufacturer / Brand <span className="text-destructive">*</span>
            </Label>
            <PaginatedDropdown
              value={values.manufacturerId}
              selectedLabel={values.manufacturerLabel}
              onValueChange={(manufacturerId) =>
                setValues((p) => ({
                  ...p,
                  manufacturerId,
                  manufacturerLabel: undefined,
                }))
              }
              queryKey={["manufacturers", "dropdown"]}
              fetchData={async ({ search, page, limit }) => {
                const res = await manufacturerApi.getManufacturers({
                  search,
                  page,
                  limit,
                });
                return {
                  options: res?.manufacturers?.map((m) => ({
                    value: m?._id,
                    label: m?.name?.en || m?._id,
                  })),
                  hasMore: res?.manufacturers?.length === limit,
                };
              }}
              placeholder="Select manufacturer"
            />
            <ProductFormHint>Required for catalog filtering.</ProductFormHint>
          </div>
        </div>
      </FormSectionCard>
    </div>
  );
}
