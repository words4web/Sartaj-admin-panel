"use client";

import { useEffect, useState } from "react";
import { FormInput } from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CouponFormProps,
  CouponFormValues,
  ECouponType,
  EDiscountType,
} from "@/types/coupon/coupon.types";

export default function CouponForm({
  initialValues,
  isSubmitting = false,
  submitLabel = "Save",
  onSubmit,
}: CouponFormProps) {
  const [values, setValues] = useState<CouponFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CouponFormValues, string>>>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof CouponFormValues, string>> = {};

    if (!values.title?.trim()) nextErrors.title = "Title is required";
    if (!values.code?.trim()) nextErrors.code = "Code is required";
    if (values.discountAmount <= 0) nextErrors.discountAmount = "Discount must be greater than 0";
    if (!values.startDate) nextErrors.startDate = "Start date is required";
    if (!values.expiryDate) nextErrors.expiryDate = "Expiry date is required";
    
    if (values.startDate && values.expiryDate && new Date(values.startDate) >= new Date(values.expiryDate)) {
      nextErrors.expiryDate = "Expiry date must be after start date";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          label="Coupon Title"
          required
          value={values?.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e?.target?.value }))}
          placeholder="e.g. Welcome Discount"
          error={errors?.title}
        />

        <FormInput
          label="Coupon Code"
          required
          value={values?.code}
          onChange={(e) => setValues((v) => ({ ...v, code: e?.target?.value?.toUpperCase?.() }))}
          placeholder="e.g. WELCOME20"
          error={errors?.code}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Label>Coupon Type</Label>
          <Select
            value={values?.type}
            onValueChange={(val: ECouponType) => setValues((v) => ({ ...v, type: val }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {Object?.values?.(ECouponType)?.map?.((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Discount Type</Label>
          <Select
            value={values?.discountType}
            onValueChange={(val: EDiscountType) => setValues((v) => ({ ...v, discountType: val }))}
          >
            <SelectTrigger className="w-full">
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
          label={`Discount ${values?.discountType === EDiscountType.PERCENT ? "(%)" : "(¥)"}`}
          type="number"
          required
          prefix={
            values?.discountType === EDiscountType.AMOUNT ? "¥" : undefined
          }
          value={values?.discountAmount}
          onChange={(e) => setValues((v) => ({ ...v, discountAmount: Number(e?.target?.value) }))}
          error={errors?.discountAmount}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormInput
          label="Usage Limit Per User"
          type="number"
          value={values?.limitPerUser}
          onChange={(e) => setValues((v) => ({ ...v, limitPerUser: Number(e?.target?.value) }))}
        />

        <FormInput
          label="Min Purchase Amount"
          type="number"
          prefix="¥"
          value={values?.minPurchase}
          onChange={(e) => setValues((v) => ({ ...v, minPurchase: Number(e?.target?.value) }))}
        />

        <FormInput
          label="Max Discount Amount"
          type="number"
          prefix="¥"
          value={values?.maxDiscount}
          onChange={(e) => setValues((v) => ({ ...v, maxDiscount: Number(e?.target?.value) }))}
          disabled={values?.discountType === EDiscountType.AMOUNT}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          label="Start Date"
          type="date"
          required
          value={values?.startDate ? new Date(values?.startDate)?.toISOString()?.split('T')?.[0] : ""}
          onChange={(e) => setValues((v) => ({ ...v, startDate: e?.target?.value }))}
          error={errors?.startDate}
        />

        <FormInput
          label="Expiry Date"
          type="date"
          required
          value={values?.expiryDate ? new Date(values?.expiryDate)?.toISOString()?.split('T')?.[0] : ""}
          onChange={(e) => setValues((v) => ({ ...v, expiryDate: e?.target?.value }))}
          error={errors?.expiryDate}
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <Switch
          id="is-active"
          checked={values?.isActive}
          onCheckedChange={(checked) => setValues((v) => ({ ...v, isActive: checked }))}
        />
        <div className="grid gap-0.5 leading-none">
          <Label htmlFor="is-active" className="text-sm font-medium cursor-pointer">
            Active Status
          </Label>
          <p className="text-xs text-gray-500">
            {values?.isActive ? "This coupon is currently visible to customers" : "This coupon is hidden from customers"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="min-w-[140px]"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
