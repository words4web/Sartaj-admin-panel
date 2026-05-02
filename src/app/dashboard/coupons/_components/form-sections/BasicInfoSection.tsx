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
import { TranslationInput } from "@/components/common/TranslationInput";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import {
  ECouponVisibility,
  CouponFormValues,
} from "@/types/coupon/coupon.types";
import { updateTranslationField } from "@/utils/translation.utils";

interface BasicInfoSectionProps {
  values: CouponFormValues;
  errors: any;
  setValues: (fn: (prev: CouponFormValues) => CouponFormValues) => void;
  superCategories: any[];
  isCategoriesLoading: boolean;
  isCategoriesError: boolean;
  refetchCategories: () => void;
}

export function BasicInfoSection({
  values,
  errors,
  setValues,
  superCategories,
  isCategoriesLoading,
  isCategoriesError,
  refetchCategories,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <TranslationInput
          title="Coupon Title"
          description="Provide the coupon title in all supported languages"
          fields={[{ key: "title", label: "Title", required: true }]}
          values={{ title: values?.title }}
          onChange={(field, lang, val) =>
            setValues((prev) =>
              updateTranslationField(prev, field as any, lang, val),
            )
          }
          errors={{ title: errors?.title }}
        />
      </div>

      <div className="p-4 rounded-xl border border-blue-100/50 space-y-4">
        <div className="space-y-2">
          <Label className="font-semibold">
            Target Super Category <span className="text-red-500">*</span>
          </Label>

          <div className="max-w-md [&>button]:h-[42px]!">
            {isCategoriesLoading ? (
              <div className=" flex items-center px-4 bg-white rounded-lg border border-gray-100">
                <CommonLoader fullScreen={false} />
              </div>
            ) : isCategoriesError ? (
              <div className="p-2 border border-red-200 rounded-lg bg-red-50 flex items-center justify-between">
                <span className="text-xs text-red-600">
                  Failed to load categories
                </span>
                <button
                  type="button"
                  onClick={() => refetchCategories()}
                  className="text-xs text-blue-600 hover:underline">
                  Retry
                </button>
              </div>
            ) : (
              <Select
                value={values?.superCategory}
                onValueChange={(val: string) =>
                  setValues((v) => ({ ...v, superCategory: val }))
                }>
                <SelectTrigger className="w-full rounded-lg border-gray-200 bg-white shadow-sm focus:ring-blue-500/20">
                  <SelectValue placeholder="Select super category" />
                </SelectTrigger>
                <SelectContent>
                  {superCategories?.map((sc: any) => (
                    <SelectItem key={sc?._id} value={sc?._id}>
                      {sc?.name || "Unnamed Category"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {errors?.superCategory && (
            <p className="text-red-500 text-xs mt-1">{errors?.superCategory}</p>
          )}
          <p className="text-[10px]">
            Assign this coupon to a specific platform segment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Coupon Code"
          required
          value={values?.code}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              code: e?.target?.value?.toUpperCase?.(),
            }))
          }
          placeholder="e.g. WELCOME20"
          error={errors?.code}
          className="py-0 shadow-sm h-[42px]!"
        />

        <div className="space-y-2 [&>button]:h-[42px]!">
          <Label className="text-sm font-medium text-gray-700">
            Visibility
          </Label>
          <Select
            value={values?.visibility}
            onValueChange={(val: ECouponVisibility) =>
              setValues((v) => ({ ...v, visibility: val }))
            }>
            <SelectTrigger className="w-full rounded-lg border-gray-200 bg-white shadow-sm focus:ring-blue-500/20">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              {Object?.values?.(ECouponVisibility)?.map?.((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px]">
            Public coupons will be visible to coustomers mobile application.
          </p>
        </div>
      </div>
    </div>
  );
}
