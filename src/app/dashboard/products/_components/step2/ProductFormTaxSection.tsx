"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSectionCard } from "../ProductFormDecorators";
import { ProductFormHint } from "../ProductFormHint";
import { ReceiptJapaneseYen, Percent } from "lucide-react";
import { useAppConfig } from "@/services/appConfig/appConfig.hooks";
import { TAX_CATEGORY, TAX_TYPE } from "@/services/appConfig/appConfig.service";
import { SetProductFormValues } from "./ProductFormPricingCatalogTab.types";
import { ProductFormValues } from "@/types/product/product.types";
import { cn } from "@/utils/common.utils";

interface ProductFormTaxSectionProps {
  values: ProductFormValues;
  setValues: SetProductFormValues;
}

export function ProductFormTaxSection({
  values,
  setValues,
}: ProductFormTaxSectionProps) {
  const { data: config } = useAppConfig();

  const isDynamicTax =
    (values.taxCategory === TAX_CATEGORY.REDUCED ||
      values.taxCategory === TAX_CATEGORY.STANDARD) &&
    values.taxType === TAX_TYPE.PERCENTAGE;

  // Auto-sync tax value when category is set but value is placeholder
  useEffect(() => {
    if (values.isTaxable && config?.taxes && values.taxCategory) {
      const selected = config.taxes.find(
        (t) => t.category === values.taxCategory,
      );
      if (selected && (values.taxValue === "0" || values.taxValue === "1")) {
        setValues((p) => ({ ...p, taxValue: String(selected.value) }));
      }
    }
  }, [values.isTaxable, values.taxCategory, config?.taxes]);

  const handleTaxToggle = (checked: boolean) => {
    const defaultCategory = TAX_CATEGORY.REDUCED;
    const defaultType = TAX_TYPE.PERCENTAGE;

    setValues((p) => ({
      ...p,
      isTaxable: checked,
      taxCategory: defaultCategory,
      taxType: defaultType,
      taxValue: "0",
    }));
  };

  const handleTaxCategoryChange = (val: string) => {
    const category = val as TAX_CATEGORY;
    const selected = config?.taxes?.find((t) => t.category === category);
    setValues((p) => ({
      ...p,
      taxCategory: category,
      taxValue: String(selected?.value ?? p.taxValue),
    }));
  };

  const handleTaxValueChange = (val: string) => {
    const sanitized = val?.replace(/[^0-9.]/g, "");
    setValues((p) => ({ ...p, taxValue: sanitized }));
  };

  return (
    <FormSectionCard title="Tax Configuration" icon={ReceiptJapaneseYen}>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl border border-primary/10 bg-primary/5 transition-colors hover:bg-primary/10">
          <div className="space-y-1">
            <Label className="text-sm font-bold text-gray-900">Apply Tax</Label>
            <p className="text-xs text-muted-foreground">
              Enable this if the product is taxable.
            </p>
          </div>
          <Switch
            checked={values.isTaxable}
            onCheckedChange={handleTaxToggle}
          />
        </div>

        {values.isTaxable && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Tax Category
                </Label>
                <Select
                  value={values.taxCategory}
                  onValueChange={handleTaxCategoryChange}
                  disabled={values.taxType === TAX_TYPE.FIXED}>
                  <SelectTrigger className="w-full h-11 bg-white border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {config?.taxes?.map((t) => (
                      <SelectItem key={t.category} value={t.category}>
                        {t.category} ({t.value}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ProductFormHint>Preset from Global Config</ProductFormHint>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Tax Type
                </Label>
                <Select
                  value={values.taxType}
                  onValueChange={(val) => {
                    const newType = val as TAX_TYPE;
                    setValues((p) => {
                      if (newType === TAX_TYPE.FIXED) {
                        return {
                          ...p,
                          taxType: newType,
                          taxCategory: TAX_CATEGORY.CUSTOM,
                        };
                      }
                      return { ...p, taxType: newType };
                    });
                  }}>
                  <SelectTrigger className="w-full h-11 bg-white border-gray-200">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TAX_TYPE.PERCENTAGE}>
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-muted-foreground" />
                        Percentage
                      </div>
                    </SelectItem>
                    <SelectItem value={TAX_TYPE.FIXED}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-muted/50 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                          ¥
                        </div>
                        Flat Value
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <ProductFormHint>Calculation method</ProductFormHint>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Resulting Tax Value
              </Label>
              <div className="relative group max-w-sm">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-500 transition-colors group-focus-within:bg-primary/10 group-focus-within:text-primary">
                  {values.taxType === TAX_TYPE.PERCENTAGE ? (
                    <Percent className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs font-bold font-serif">¥</span>
                  )}
                </div>
                <Input
                  className={cn(
                    "h-11 pl-11 bg-white font-medium border-gray-200 transition-all focus-visible:ring-primary/20",
                    !isDynamicTax &&
                      values.taxType === TAX_TYPE.PERCENTAGE &&
                      (Number(values.taxValue) < 0 ||
                        Number(values.taxValue) > 100) &&
                      "border-destructive/30 focus-visible:ring-destructive/20",
                    !isDynamicTax &&
                      values.taxType === TAX_TYPE.FIXED &&
                      Number(values.taxValue) < 0 &&
                      "border-destructive/30 focus-visible:ring-destructive/20",
                    isDynamicTax &&
                      "bg-gray-50 text-gray-400 cursor-not-allowed opacity-80",
                  )}
                  type="text"
                  placeholder={
                    isDynamicTax ? "Fetched statically from settings" : "0"
                  }
                  value={
                    isDynamicTax && config?.taxes
                      ? String(
                          config.taxes.find(
                            (t) => t?.category === values.taxCategory,
                          )?.value ?? values.taxValue,
                        )
                      : values.taxValue
                  }
                  onChange={(e) => handleTaxValueChange(e.target.value)}
                  disabled={isDynamicTax}
                  readOnly={isDynamicTax}
                />
              </div>
              {(() => {
                if (!isDynamicTax) {
                  const numVal = Number(values.taxValue);
                  if (
                    values.taxType === TAX_TYPE.PERCENTAGE &&
                    (numVal < 0 || numVal > 100)
                  ) {
                    return (
                      <p className="text-[11px] text-destructive font-semibold mt-1 flex items-center gap-1.5 animate-pulse">
                        <span className="w-1 h-1 rounded-full bg-destructive" />
                        Percentage must be between 0 and 100.
                      </p>
                    );
                  }
                  if (values.taxType === TAX_TYPE.FIXED && numVal < 0) {
                    return (
                      <p className="text-[11px] text-destructive font-semibold mt-1 flex items-center gap-1.5 animate-pulse">
                        <span className="w-1 h-1 rounded-full bg-destructive" />
                        Fixed value cannot be negative.
                      </p>
                    );
                  }
                }
                return (
                  <ProductFormHint>
                    {isDynamicTax
                      ? "Value is dynamically kept up to date by global settings."
                      : `Final ${values.taxType?.toLowerCase() || "percentage"} amount applied.`}
                  </ProductFormHint>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </FormSectionCard>
  );
}
