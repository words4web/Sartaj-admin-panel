"use client";

import { useEffect, useState } from "react";
import { FormInput } from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  PriceListFormValues,
  PriceListItemRow,
} from "@/types/priceList/priceList.types";
import { SUPER_CATEGORIES } from "@/lib/constants";
import { useProductList } from "@/services/product/product.hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { IProduct } from "@/types/product/product.types";
import { formatYen, extractId } from "@/utils/common.utils";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PriceListFormProps } from "./types/PriceListForm.types";

function productLabel(p: IProduct) {
  return `${p?.sku} — ${p?.name?.en ?? "—"}`;
}

export default function PriceListForm({
  superCategories,
  initialValues,
  isSubmitting = false,
  submitLabel = "Save",
  onSubmit,
}: PriceListFormProps) {
  const [values, setValues] = useState<PriceListFormValues>(initialValues);
  const [productSearch, setProductSearch] = useState("");
  const debouncedProductSearch = useDebounce(productSearch, 350);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const { data: productData, isFetching: productsLoading } = useProductList({
    search: debouncedProductSearch || undefined,
    page: 1,
    limit: 20,
  });

  const productHits = productData?.products ?? [];

  const addProduct = (p: IProduct) => {
    if (values?.items?.some((row) => row?.productId === p?._id)) {
      toast.message("Product already in this list");
      return;
    }

    const basePriceMatch = p?.basePrices?.find((bp) => {
      const bpId = extractId(bp?.superCategoryId);
      return bpId === values?.superCategoryId;
    });
    const defaultPrice = basePriceMatch?.price ?? 0;

    setValues((v) => ({
      ...v,
      items: [
        ...v?.items,
        {
          productId: p?._id,
          sku: p?.sku,
          name: p?.name?.en ?? null,
          price: defaultPrice,
        },
      ],
    }));
    setProductSearch("");
  };

  const updateItemPrice = (productId: string, price: number) => {
    setValues((v) => ({
      ...v,
      items: v?.items?.map((row) =>
        row?.productId === productId ? { ...row, price } : row,
      ),
    }));
  };

  const removeItem = (productId: string) => {
    setValues((v) => ({
      ...v,
      items: v?.items?.filter((row) => row?.productId !== productId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = values?.name?.trim();
    if (!name) {
      toast.error("Name is required");
      return;
    }
    if (!values?.superCategoryId) {
      toast.error("Super category is required");
      return;
    }
    if (values?.items?.length === 0) {
      toast.error("At least 1 item is required in the price list");
      return;
    }
    const invalid = values?.items?.some(
      (row) => !Number.isFinite(row?.price) || row?.price < 0,
    );
    if (invalid) {
      toast.error("Each price must be zero or greater");
      return;
    }

    await onSubmit({
      name,
      superCategoryId: values?.superCategoryId,
      items: values?.items?.map((row) => ({
        productId: row?.productId,
        price: Number(row?.price),
      })),
    });
  };

  const segmentOptions =
    superCategories?.filter(
      (sc) => String(sc?.name) !== SUPER_CATEGORIES.RETAILER,
    ) ?? [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="List name"
            required
            placeholder="e.g. Tokyo wholesale overrides"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Super category <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={values.superCategoryId}
              disabled={isSubmitting || segmentOptions.length === 0}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  superCategoryId: e.target.value,
                }))
              }
              className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              <option value="" disabled>
                Select segment
              </option>
              {segmentOptions?.map((sc) => (
                <option key={sc?._id} value={sc?._id}>
                  {sc?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Product overrides</h3>
          <p className="text-sm text-gray-600">
            Search by SKU or name, then set a custom unit price in yen. Other
            products keep the segment base price.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Add product
          </label>
          <Input
            placeholder="Type SKU or product name…"
            value={productSearch}
            disabled={isSubmitting}
            onChange={(e) => setProductSearch(e.target.value)}
          />
          {productsLoading && (
            <p className="text-xs text-gray-500">Searching…</p>
          )}
          {debouncedProductSearch && productHits?.length > 0 && (
            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
              {productHits?.map((p) => (
                <button
                  key={p?._id}
                  type="button"
                  disabled={isSubmitting}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => addProduct(p)}>
                  {productLabel(p)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {values?.items?.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center border border-dashed rounded-lg">
              No overrides yet. Prices will fall back to product base prices for
              this segment.
            </p>
          ) : (
            values?.items?.map((row: PriceListItemRow) => (
              <div
                key={row?.productId}
                className="flex flex-col sm:flex-row sm:items-end gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-mono">{row?.sku}</p>
                  <p className="font-medium text-gray-900 truncate">
                    {row.name ?? "—"}
                  </p>
                </div>
                <div className="w-full sm:w-40">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Price (¥)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    disabled={isSubmitting}
                    value={Number.isFinite(row.price) ? row.price : 0}
                    onChange={(e) =>
                      updateItemPrice(
                        row.productId,
                        Number(e.target.value) || 0,
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatYen(Number(row.price) || 0)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="text-red-600 border-red-200 shrink-0"
                  disabled={isSubmitting}
                  onClick={() => removeItem(row.productId)}
                  aria-label="Remove product">
                  <Trash2 size={16} />
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
