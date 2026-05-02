"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormInput } from "@/components/common/FormInput";
import { CouponFormValues } from "@/types/coupon/coupon.types";
import dayjs from "dayjs";

interface ValiditySectionProps {
  values: CouponFormValues;
  errors: any;
  setValues: (fn: (prev: CouponFormValues) => CouponFormValues) => void;
}

export function ValiditySection({
  values,
  errors,
  setValues,
}: ValiditySectionProps) {
  const formattedStart = values?.startDate
    ? dayjs(values.startDate).format("YYYY-MM-DD")
    : "";
  const formattedExpiry = values?.expiryDate
    ? dayjs(values.expiryDate).format("YYYY-MM-DD")
    : "";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Start Date"
          type="date"
          required
          value={formattedStart}
          onChange={(e) => {
            const val = e?.target?.value;
            setValues((v) => ({ ...v, startDate: val }));
          }}
          error={errors?.startDate}
          className="h-[42px] py-0 shadow-sm"
        />

        <FormInput
          label="Expiry Date"
          type="date"
          required
          min={formattedStart}
          value={formattedExpiry}
          onChange={(e) => {
            const val = e?.target?.value;
            setValues((v) => ({ ...v, expiryDate: val }));
          }}
          error={errors?.expiryDate}
          className="h-[42px] py-0 shadow-sm"
        />
      </div>

      <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-gray-50">
        <Switch
          id="is-active"
          checked={values?.isActive}
          onCheckedChange={(checked) =>
            setValues((v) => ({ ...v, isActive: checked }))
          }
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="is-active"
            className="text-sm font-semibold text-gray-900 cursor-pointer">
            Active Status
          </Label>
          <p className="text-xs text-gray-500">
            {values?.isActive
              ? "This coupon is currently visible and usable by customers"
              : "This coupon is hidden and cannot be used"}
          </p>
        </div>
      </div>
    </div>
  );
}
