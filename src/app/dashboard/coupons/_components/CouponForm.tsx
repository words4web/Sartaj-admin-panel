"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CouponFormProps,
  CouponFormValues,
  EDiscountType,
} from "@/types/coupon/coupon.types";
import { isTranslationComplete } from "@/utils/translation.utils";
import dayjs from "dayjs";
import { useSuperCategories } from "@/services/superCategory/superCategory.hooks";

// Sub-sections
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { DiscountRulesSection } from "./form-sections/DiscountRulesSection";
import { ValiditySection } from "./form-sections/ValiditySection";

export default function CouponForm({
  initialValues,
  isSubmitting = false,
  submitLabel = "Save",
  onSubmit,
}: CouponFormProps) {
  const [values, setValues] = useState<CouponFormValues>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CouponFormValues | string, string>>
  >({});

  const {
    data: superCategories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useSuperCategories();

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof CouponFormValues | string, string>> =
      {};

    if (!isTranslationComplete(values?.title))
      nextErrors.title = "All title translations are required";
    if (!values?.code?.trim()) nextErrors.code = "Code is required";
    if (!values?.superCategory)
      nextErrors.superCategory = "Super Category is required";

    // New Stricter Discount Validation
    const val = Number(values?.discountValue);
    if (!val || val <= 0) {
      nextErrors.discountValue = "Discount must be greater than 0";
    } else if (values?.discountType === EDiscountType.PERCENT && val > 100) {
      nextErrors.discountValue = "Percentage discount cannot exceed 100%";
    }

    if (!values?.startDate) nextErrors.startDate = "Start date is required";
    if (!values?.expiryDate) nextErrors.expiryDate = "Expiry date is required";

    if (
      values?.startDate &&
      values?.expiryDate &&
      dayjs(values.startDate).isAfter(dayjs(values.expiryDate))
    ) {
      nextErrors.expiryDate = "Expiry date must be after start date";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      // Wait for re-render then scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector(
          ".text-red-500, .text-red-600",
        );
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
      return;
    }

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-10">
        {/** Section 1: Basic Configuration **/}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
              1
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              General Information
            </h3>
          </div>
          <BasicInfoSection
            values={values}
            errors={errors}
            setValues={setValues}
            superCategories={superCategories}
            isCategoriesLoading={isCategoriesLoading}
            isCategoriesError={isCategoriesError}
            refetchCategories={refetchCategories}
          />
        </section>

        <hr className="border-gray-100" />

        {/** Section 2: Discount Logic **/}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold">
              2
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              Discount Rules
            </h3>
          </div>
          <DiscountRulesSection
            values={values}
            errors={errors}
            setValues={setValues}
          />
        </section>

        <hr className="border-gray-100" />

        {/** Section 3: Scheduling **/}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
              3
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              Validity & Status
            </h3>
          </div>
          <ValiditySection
            values={values}
            errors={errors}
            setValues={setValues}
          />
        </section>
      </div>

      <div className="flex items-center justify-end gap-3 pt-8 border-t border-gray-100">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[160px] h-[48px] rounded-lg shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
