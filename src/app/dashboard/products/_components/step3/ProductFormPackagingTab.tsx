"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormHint } from "../ProductFormHint";
import {
  PRODUCT_UNITS,
  SELLING_UNITS,
  PRODUCT_TYPES,
  STOCK_STATUSES,
  SELLING_UNIT,
  STOCK_STATUS,
  PRODUCT_TYPE,
  PRODUCT_CASE_TYPE_OPTIONS,
} from "@/constants/product.constants";
import { ProductFormPackagingTabProps } from "./ProductFormPackagingTab.types";
import type {
  ProductUnit,
  ProductType,
  SellingUnit,
  StockStatus,
} from "@/types/product/product.types";
import type { ProductFormValues } from "@/types/product/product.types";

export function ProductFormPackagingTab({
  values,
  setValues,
}: ProductFormPackagingTabProps) {
  const isUnitSelling = values?.sellingUnit === SELLING_UNIT.UNIT;
  const isOutOfStock = values?.stockStatus === STOCK_STATUS.OUT_OF_STOCK;

  const handleSellingUnitChange = (sellingUnit: SellingUnit) => {
    setValues((p) => ({
      ...p,
      sellingUnit,
      caseQuantity: sellingUnit === SELLING_UNIT.UNIT ? "1" : p?.caseQuantity,
      caseType: sellingUnit === SELLING_UNIT.UNIT ? "" : p?.caseType,
    }));
  };

  const handleStockStatusChange = (stockStatus: StockStatus) => {
    setValues((p) => ({
      ...p,
      stockStatus,
      stockQuantity:
        stockStatus === STOCK_STATUS.OUT_OF_STOCK ? "0" : p?.stockQuantity,
    }));
  };

  const handleTextChange = (
    field: keyof ProductFormValues,
    val: string,
    isInteger = false,
  ) => {
    let sanitized = val?.replace(isInteger ? /[^0-9]/g : /[^0-9.]/g, "");
    if (!isInteger) {
      const parts = sanitized?.split(".");
      sanitized =
        parts?.[0] + (parts?.length > 1 ? "." + parts?.slice(1)?.join("") : "");
    }
    setValues((p) => ({ ...p, [field]: sanitized }));
  };

  return (
    <div className="space-y-6 px-6">
      {/* ── Packaging ── */}
      <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3 mb-1">
          <h3 className="text-sm font-semibold text-gray-800">
            Packaging Details
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Unit */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Unit <span className="text-destructive">*</span>
            </Label>
            <div className="w-full">
              <Select
                value={values.unit || ""}
                onValueChange={(unit) =>
                  setValues((p) => ({ ...p, unit: unit as ProductUnit }))
                }>
                <SelectTrigger className="w-full bg-white shadow-none border-gray-200 h-10">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_UNITS?.map((u) => (
                    <SelectItem key={u.key} value={u.key}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ProductFormHint>Measurement for one unit.</ProductFormHint>
          </div>

          {/* Net weight */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Net weight (kg) <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              placeholder="0.000"
              className="bg-white shadow-none border-gray-200 h-10"
              value={values.netWeightKg}
              onChange={(e) => handleTextChange("netWeightKg", e.target.value)}
            />
            <ProductFormHint>Weight in kilograms.</ProductFormHint>
          </div>

          {/* Selling unit */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Selling unit <span className="text-destructive">*</span>
            </Label>
            <div className="w-full">
              <Select
                value={values.sellingUnit || SELLING_UNIT.UNIT}
                onValueChange={(v) =>
                  handleSellingUnitChange(v as SellingUnit)
                }>
                <SelectTrigger className="w-full bg-white shadow-none border-gray-200 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SELLING_UNITS?.map((u) => (
                    <SelectItem key={u.key} value={u.key}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ProductFormHint>How stock is counted.</ProductFormHint>
          </div>

          {/* Case quantity */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Case quantity <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. 12"
              disabled={isUnitSelling}
              className="bg-white shadow-none border-gray-200 h-10 disabled:bg-gray-100/50"
              value={isUnitSelling ? "1" : values.caseQuantity}
              onChange={(e) =>
                handleTextChange("caseQuantity", e.target.value, true)
              }
            />
            <ProductFormHint>
              {isUnitSelling ? "Fixed at 1 for units." : "Units per case."}
            </ProductFormHint>
          </div>

          {/* Case type */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Case type{" "}
              {isUnitSelling ? "" : <span className="text-destructive">*</span>}
            </Label>
            <Select
              disabled={isUnitSelling}
              value={isUnitSelling ? "" : values.caseType || ""}
              onValueChange={(v) =>
                setValues((p) => ({ ...p, caseType: v as any }))
              }>
              <SelectTrigger className="w-full bg-white shadow-none border-gray-200 h-10 disabled:bg-gray-100/50">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CASE_TYPE_OPTIONS?.map((o) => (
                  <SelectItem key={o.key} value={o.key}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ProductFormHint>Packaging format (e.g. Bottle).</ProductFormHint>
          </div>

          {/* Product type */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Product type
            </Label>
            <Select
              value={values.productType || PRODUCT_TYPE.DRY}
              onValueChange={(productType) =>
                setValues((p) => ({
                  ...p,
                  productType: productType as ProductType,
                }))
              }>
              <SelectTrigger className="w-full bg-white shadow-none border-gray-200 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES?.map((t) => (
                  <SelectItem key={t.key} value={t.key}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ProductFormHint>Affects delivery.</ProductFormHint>
          </div>
        </div>
      </div>

      {/* ── Inventory ── */}
      <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3 mb-1">
          <h3 className="text-sm font-semibold text-gray-800">
            Inventory Management
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 max-w-lg">
          {/* Stock status */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Stock status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={values.stockStatus || STOCK_STATUS.IN_STOCK}
              onValueChange={(v) => handleStockStatusChange(v as StockStatus)}>
              <SelectTrigger className="w-full bg-white shadow-none border-gray-200 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STOCK_STATUSES?.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ProductFormHint>Visibility in catalog.</ProductFormHint>
          </div>

          {/* Stock quantity */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Stock quantity <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              placeholder="0"
              disabled={isOutOfStock}
              className="bg-white shadow-none border-gray-200 h-10 disabled:bg-gray-100/50"
              value={isOutOfStock ? "0" : values.stockQuantity}
              onChange={(e) =>
                handleTextChange("stockQuantity", e.target.value, true)
              }
            />
            <ProductFormHint>
              {isUnitSelling ? "Individual units." : "Number of cases."}
            </ProductFormHint>
          </div>
        </div>
      </div>
    </div>
  );
}
