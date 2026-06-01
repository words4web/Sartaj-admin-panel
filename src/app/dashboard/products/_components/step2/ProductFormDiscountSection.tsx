"use client";

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
import { Timer, Percent, CalendarDays } from "lucide-react";
import { SetProductFormValues } from "./ProductFormPricingCatalogTab.types";
import { ProductFormValues } from "@/types/product/product.types";
import { DISCOUNT_TYPE } from "@/services/appConfig/appConfig.service";
import { cn } from "@/utils/common.utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ProductFormDiscountSectionProps {
  values: ProductFormValues;
  setValues: SetProductFormValues;
}

export function ProductFormDiscountSection({
  values,
  setValues,
}: ProductFormDiscountSectionProps) {
  const handleToggle = (checked: boolean) => {
    if (checked) {
      setValues((p) => ({
        ...p,
        timeDiscount: {
          ...p.timeDiscount,
          isEnabled: true,
          startTime: dayjs().toISOString(),
          endTime: dayjs().add(24, "hours").toISOString(),
        },
      }));
    } else {
      setValues((p) => ({
        ...p,
        timeDiscount: {
          ...p.timeDiscount,
          isEnabled: false,
          startTime: dayjs().toISOString(),
          endTime: dayjs().add(24, "hours").toISOString(),
          discountType: DISCOUNT_TYPE.PERCENTAGE,
          discountValue: "0",
        },
      }));
    }
  };

  /** Convert ISO string to YYYY-MM-DDTHH:mm for <input type="datetime-local" /> */
  const formatForInput = (iso: string | Date) => {
    if (!iso) return "";
    return dayjs(iso).tz("Asia/Tokyo")?.format("YYYY-MM-DDTHH:mm");
  };

  /** Convert input value to ISO string, treating it as Asia/Tokyo */
  const handleDateTimeChange = (
    field: "startTime" | "endTime",
    val: string,
  ) => {
    if (!val) return;
    const iso = dayjs.tz(val, "Asia/Tokyo")?.toISOString();
    setValues((p) => ({
      ...p,
      timeDiscount: {
        ...p.timeDiscount,
        [field]: iso,
      },
    }));
  };

  const handleDiscountTypeChange = (val: string) => {
    const newType = val as DISCOUNT_TYPE;
    setValues((p) => ({
      ...p,
      timeDiscount: {
        ...p.timeDiscount,
        discountType: newType,
        discountValue: "0",
      },
    }));
  };

  const handleValueChange = (val: string) => {
    const isPercentage =
      values.timeDiscount.discountType === DISCOUNT_TYPE.PERCENTAGE;
    const sanitized = val?.replace(/[^0-9]/g, "");
    const num = Number(sanitized);
    if (isPercentage && num > 100) return;

    setValues((p) => ({
      ...p,
      timeDiscount: {
        ...p.timeDiscount,
        discountValue: sanitized,
      },
    }));
  };

  const discountVal = Number(values.timeDiscount.discountValue || "0");
  const isPercentage =
    values.timeDiscount.discountType === DISCOUNT_TYPE.PERCENTAGE;
  const isError = isPercentage
    ? discountVal < 1 || discountVal > 100
    : discountVal <= 0;

  return (
    <FormSectionCard title="Time-Based Discount" icon={Timer}>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl border border-primary/10 bg-primary/5 transition-colors hover:bg-primary/10">
          <div className="space-y-1">
            <Label className="text-sm font-bold text-gray-900">
              Apply Time Discount
            </Label>
            <p className="text-xs text-muted-foreground">
              Enable discount during a specific window (Asia/Tokyo).
            </p>
          </div>
          <Switch
            checked={values.timeDiscount.isEnabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {values.timeDiscount.isEnabled && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Start Date & Time
                </Label>
                <div className="relative group">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                  <Input
                    type="datetime-local"
                    className="h-11 pl-10 bg-white border-gray-200"
                    value={formatForInput(values.timeDiscount.startTime)}
                    onChange={(e) =>
                      handleDateTimeChange("startTime", e.target.value)
                    }
                  />
                </div>
                <ProductFormHint>When the discount begins</ProductFormHint>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  End Date & Time
                </Label>
                <div className="relative group">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                  <Input
                    type="datetime-local"
                    className="h-11 pl-10 bg-white border-gray-200"
                    value={formatForInput(values.timeDiscount.endTime)}
                    onChange={(e) =>
                      handleDateTimeChange("endTime", e.target.value)
                    }
                  />
                </div>
                <ProductFormHint>When the discount expires</ProductFormHint>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Discount Type
                </Label>
                <Select
                  value={values.timeDiscount.discountType}
                  onValueChange={handleDiscountTypeChange}>
                  <SelectTrigger className="w-full h-11 bg-white border-gray-200">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DISCOUNT_TYPE.PERCENTAGE}>
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-muted-foreground" />
                        Percentage
                      </div>
                    </SelectItem>
                    <SelectItem value={DISCOUNT_TYPE.FIXED}>
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

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Discount Value
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-500 transition-colors group-focus-within:bg-primary/10 group-focus-within:text-primary">
                    {values.timeDiscount.discountType ===
                    DISCOUNT_TYPE.FIXED ? (
                      <span className="text-xs font-bold font-serif">¥</span>
                    ) : (
                      <Percent className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <Input
                    className={cn(
                      "h-11 pl-11 bg-white font-medium border-gray-200 transition-all focus-visible:ring-primary/20",
                      isError &&
                        "border-destructive/30 focus-visible:ring-destructive/20",
                    )}
                    type="text"
                    placeholder="0"
                    value={values.timeDiscount.discountValue}
                    onChange={(e) => handleValueChange(e.target.value)}
                  />
                </div>
                {isError ? (
                  <p className="text-[11px] text-destructive font-semibold mt-1 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1 h-1 rounded-full bg-destructive" />
                    {values.timeDiscount.discountType ===
                    DISCOUNT_TYPE.PERCENTAGE
                      ? "Percentage must be between 1 and 100."
                      : "Fixed value must be greater than 0."}
                  </p>
                ) : (
                  <ProductFormHint>
                    {values.timeDiscount.discountType ===
                    DISCOUNT_TYPE.PERCENTAGE
                      ? "Percentage off base price."
                      : "Flat amount off base price."}
                  </ProductFormHint>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </FormSectionCard>
  );
}
