"use client";

import { useCallback, useState } from "react";
import { Link2, X } from "lucide-react";
import { PaginatedDropdown } from "@/components/common/PaginatedDropdown";
import { productApi } from "@/services/product/product.api";
import { ProductFormHint } from "../ProductFormHint";

interface RelatedProductsPickerProps {
  selected: string[];
  initialLabels?: Record<string, string>;
  onChange: (ids: string[]) => void;
  currentProductId?: string;
}

export function RelatedProductsPicker({
  selected,
  initialLabels,
  onChange,
  currentProductId,
}: RelatedProductsPickerProps) {
  const [labels, setLabels] = useLabels(initialLabels);

  const handleSelect = useCallback(
    (value: string, label: string) => {
      if (!value || selected?.includes(value)) return;
      setLabels((prev) => ({ ...prev, [value]: label }));
      onChange([...selected, value]);
    },
    [selected, onChange, setLabels],
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange(selected?.filter((s) => s !== id));
    },
    [selected, onChange],
  );

  const fetchProducts = useCallback(
    ({
      search,
      page,
      limit,
    }: {
      search: string;
      page: number;
      limit: number;
    }) =>
      productApi.searchProducts({
        search,
        page,
        limit,
        excludeIds: currentProductId ? [currentProductId] : [],
      }),
    [currentProductId],
  );

  return (
    <div className="space-y-3">
      <PaginatedDropdown
        value=""
        onValueChange={(val) => {
          // find the label from the last loaded options via selectedLabel trick
          handleSelect(val, labels[val] ?? val);
        }}
        fetchData={async (params) => {
          const result = await fetchProducts(params);
          // Cache labels for selected pills
          result?.options?.forEach((o) =>
            setLabels((prev) =>
              prev[o.value] ? prev : { ...prev, [o.value]: o.label },
            ),
          );
          return result;
        }}
        queryKey={[
          "related-product-search",
          currentProductId,
          selected?.join(","),
        ]}
        placeholder="Search and add products…"
        searchPlaceholder="Search by SKU or name…"
        limit={8}
        className="w-[320px]"
        selectedValues={selected}
      />

      {/* Pills */}
      {selected?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {selected?.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-1">
              <Link2 className="w-3 h-3 shrink-0" />
              <span className="max-w-[160px] truncate">{labels[id] ?? id}</span>
              <button
                type="button"
                onClick={() => handleRemove(id)}
                className="ml-0.5 rounded-full hover:text-destructive transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <ProductFormHint>
        Products shown as suggestions alongside this product.
      </ProductFormHint>
    </div>
  );
}

// Tiny hook to hold label map state in closure
function useLabels(initial?: Record<string, string>) {
  return useState<Record<string, string>>(initial || {});
}
