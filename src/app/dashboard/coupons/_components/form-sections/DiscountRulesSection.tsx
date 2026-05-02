"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormInput } from "@/components/common/FormInput";
import { EDiscountType, CouponFormValues } from "@/types/coupon/coupon.types";

interface DiscountRulesSectionProps {
  values: CouponFormValues;
  errors: any;
  setValues: (fn: (prev: CouponFormValues) => CouponFormValues) => void;
}

export function DiscountRulesSection({
  values,
  errors,
  setValues,
}: DiscountRulesSectionProps) {
  const isPercent = values?.discountType === EDiscountType.PERCENT;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 [&>button]:h-[42px]!">
          <Label className="text-sm font-medium text-gray-700">
            Discount Type
          </Label>
          <Select
            value={values?.discountType}
            onValueChange={(val: EDiscountType) =>
              setValues((v) => ({ ...v, discountType: val, discountValue: 0 }))
            }>
            <SelectTrigger className="w-full h-[48px] rounded-lg border-gray-200 bg-white shadow-sm focus:ring-blue-500/20">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {Object?.values?.(EDiscountType)?.map?.((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FormInput
          label={`Discount ${isPercent ? "(%)" : "(¥)"}`}
          type="number"
          required
          min={1}
          max={isPercent ? 100 : undefined}
          prefix={!isPercent ? "¥" : undefined}
          value={values?.discountValue}
          onChange={(e) => {
            const val = Number(e.target.value);
            // Strict sanitization as requested
            if (isPercent && val > 100) return;
            setValues((v) => ({ ...v, discountValue: val < 0 ? 0 : val }));
          }}
          error={errors?.discountValue}
          helperText={
            isPercent
              ? "Enter a percentage between 1 and 100"
              : "Enter an amount greater than 0"
          }
          className="h-[42px] py-0 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Min Purchase Amount"
          type="number"
          prefix="¥"
          min={0}
          value={values?.minPurchase}
          onChange={(e) => {
            const val = Number(e.target.value);
            setValues((v) => ({ ...v, minPurchase: val < 0 ? 0 : val }));
          }}
          className="h-[42px] py-0 shadow-sm"
        />

        {isPercent && (
          <FormInput
            label="Max Discount Amount"
            type="number"
            prefix="¥"
            min={0}
            value={values?.maxDiscount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setValues((v) => ({ ...v, maxDiscount: val < 0 ? 0 : val }));
            }}
            helperText="Optional limit for percentage discounts"
            className="h-[42px] py-0 shadow-sm"
          />
        )}
      </div>
    </div>
  );
}
