"use client";

import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaginatedDropdown } from "@/components/common/PaginatedDropdown";
import { productApi } from "@/services/product/product.api";
import { X } from "lucide-react";

import { BundleFormProps } from "@/types/bundle/bundle.types";

export default function BundleForm({
  initialData,
  isSubmitting,
  onSubmit,
}: BundleFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [discountValue, setDiscountValue] = useState(
    initialData?.discountValue || 0,
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>(() => {
    if (!initialData?.productIds) return [];
    return initialData.productIds.map((p) =>
      typeof p === "object" ? p._id : p,
    );
  });
  const [labels, setLabels] = useState<Record<string, string>>(() => {
    if (!initialData?.productIds) return {};
    const initLabels: Record<string, string> = {};
    initialData.productIds.forEach((p) => {
      if (typeof p === "object" && p._id) {
        const name = typeof p.name === "object" ? p.name.en : p.name;
        initLabels[p._id] = name || p.sku || p._id;
      }
    });
    return initLabels;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.discountValue)
        setDiscountValue(initialData.discountValue);
      if (initialData.productIds) {
        const ids = initialData.productIds.map((p) =>
          typeof p === "object" ? p._id : p,
        );
        setSelectedProducts(ids);
        const initLabels: Record<string, string> = {};
        initialData.productIds.forEach((p) => {
          if (typeof p === "object" && p._id) {
            const name = typeof p.name === "object" ? p.name.en : p.name;
            initLabels[p._id] = name || p.sku || p._id;
          }
        });
        setLabels(initLabels);
      }
    }
  }, [initialData]);

  const handleSelect = useCallback(
    (value: string, label: string) => {
      if (!value || selectedProducts?.includes(value)) return;
      if (selectedProducts?.length >= 3) {
        setErrors((prev) => ({
          ...prev,
          products: "A bundle can have a maximum of 3 products",
        }));
        return;
      }
      setLabels((prev) => ({ ...prev, [value]: label }));
      setSelectedProducts((prev) => [...prev, value]);
      setErrors((prev) => ({ ...prev, products: "" }));
    },
    [selectedProducts],
  );

  const handleRemove = useCallback((id: string) => {
    setSelectedProducts((prev) => prev.filter((pid) => pid !== id));
  }, []);

  const fetchProducts = useCallback(
    ({
      search,
      page,
      limit,
    }: {
      search: string;
      page: number;
      limit: number;
    }) => productApi.searchProducts({ search, page, limit }),
    [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!title?.trim()) nextErrors.title = "Title is required";
    if (selectedProducts?.length < 2)
      nextErrors.products = "Select at least 2 products for the bundle";
    if (discountValue <= 0)
      nextErrors.discountValue = "Discount must be greater than 0";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title,
      productIds: selectedProducts,
      discountValue,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-sm font-semibold text-gray-700">
            Bundle Title
          </Label>
          <Input
            id="title"
            placeholder="e.g. Snack & Dessert Pair"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Products (2 to 3 products)
          </Label>
          <PaginatedDropdown
            value=""
            onValueChange={(val, label) => {
              if (val) {
                handleSelect(val, label ?? labels[val] ?? val);
              }
            }}
            fetchData={async (params) => {
              const result = await fetchProducts(params);
              result?.options?.forEach((o) =>
                setLabels((prev) =>
                  prev[o.value] ? prev : { ...prev, [o.value]: o.label },
                ),
              );
              return result;
            }}
            queryKey={["bundle-product-search", selectedProducts?.join(",")]}
            placeholder="Search and select products…"
            searchPlaceholder="Search by SKU or name…"
            limit={8}
            selectedValues={selectedProducts}
          />

          {errors.products && (
            <p className="text-xs text-red-500">{errors.products}</p>
          )}

          {selectedProducts?.length > 0 && (
            <div className="flex flex-col gap-2 mt-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
              {selectedProducts?.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between text-xs font-semibold bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm">
                  <span className="line-clamp-1 flex-1 pr-2">
                    • {labels[id] || id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="discount"
            className="text-sm font-semibold text-gray-700">
            Discount Amount (¥)
          </Label>
          <Input
            id="discount"
            type="number"
            min={1}
            placeholder="e.g. 200"
            value={discountValue || ""}
            onChange={(e) => {
              setDiscountValue(Number(e.target.value));
              setErrors((prev) => ({ ...prev, discountValue: "" }));
            }}
            className={errors.discountValue ? "border-red-500" : ""}
          />
          {errors.discountValue && (
            <p className="text-xs text-red-500">{errors.discountValue}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving Bundle…"
            : initialData
              ? "Update Bundle"
              : "Create Bundle"}
        </Button>
      </div>
    </form>
  );
}
