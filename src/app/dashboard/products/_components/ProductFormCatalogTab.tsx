"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormHint } from "./ProductFormHint";
import { ProductFormCatalogTabProps } from "./types/ProductFormCatalogTab.types";

export function ProductFormCatalogTab({
  values,
  setValues,
  categories,
  subcategories,
  manufacturers,
}: ProductFormCatalogTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Parent category */}
        <div className="space-y-2">
          <Label>
            Parent category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={values.categoryId || undefined}
            onValueChange={(categoryId) =>
              setValues((p) => ({ ...p, categoryId, subcategoryId: "" }))
            }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a parent category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((c) => (
                <SelectItem key={c?._id} value={c?._id}>
                  {c?.name?.en ?? c?._id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ProductFormHint>
            Top-level category used for grouping and filters.
          </ProductFormHint>
        </div>

        {/* Subcategory */}
        <div className="space-y-2">
          <Label>Subcategory</Label>
          <Select
            value={values.subcategoryId || undefined}
            onValueChange={(subcategoryId) =>
              setValues((p) => ({ ...p, subcategoryId }))
            }
            disabled={!values.categoryId || subcategories?.length === 0}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  !values.categoryId
                    ? "Select a parent category first"
                    : subcategories?.length === 0
                      ? "No subcategories — parent only"
                      : "Select a subcategory"
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
          <ProductFormHint>
            {subcategories?.length > 0
              ? "Required when this parent has subcategories."
              : "This parent has no subcategories — the product is filed under the parent only."}
          </ProductFormHint>
        </div>
      </div>

      {/* Manufacturer */}
      <div className="space-y-2 max-w-sm">
        <Label>
          Manufacturer / Brand <span className="text-destructive">*</span>
        </Label>
        <Select
          value={values.manufacturerId || undefined}
          onValueChange={(manufacturerId) =>
            setValues((p) => ({ ...p, manufacturerId }))
          }>
          <SelectTrigger className="w-full">
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
        <ProductFormHint>
          Each product must be linked to one manufacturer.
        </ProductFormHint>
      </div>
    </div>
  );
}
