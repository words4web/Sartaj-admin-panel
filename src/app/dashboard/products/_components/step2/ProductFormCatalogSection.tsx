"use client";

import { Label } from "@/components/ui/label";
import { PaginatedDropdown } from "@/components/common/PaginatedDropdown";
import { categoryApi } from "@/services/category/category.api";
import { manufacturerApi } from "@/services/manufacturer/manufacturer.api";
import { FormSectionCard } from "../ProductFormDecorators";
import { ProductFormHint } from "../ProductFormHint";
import { Layers } from "lucide-react";
import { SetProductFormValues } from "./ProductFormPricingCatalogTab.types";
import { ProductFormValues } from "@/types/product/product.types";

interface ProductFormCatalogSectionProps {
  values: ProductFormValues;
  setValues: SetProductFormValues;
  hasSubcategories: boolean | null;
  setHasSubcategories: (val: boolean | null) => void;
}

export function ProductFormCatalogSection({
  values,
  setValues,
  hasSubcategories,
  setHasSubcategories,
}: ProductFormCatalogSectionProps) {
  return (
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

              const filtered = search
                ? res?.filter((c) =>
                    c?.name?.en?.toLowerCase()?.includes(search?.toLowerCase()),
                  )
                : res;

              return {
                options: filtered?.map((c) => ({
                  value: c?._id,
                  label: c?.name?.en || c?._id,
                })),
                hasMore: false,
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
  );
}
