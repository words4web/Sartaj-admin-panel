"use client";

import { useEffect, useMemo, useState } from "react";
import { FormInput } from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CustomerFormProps,
  CustomerFormValues,
  IAddress,
} from "@/types/customer/customer.types";
import { createCustomerSchema } from "@/schemas/customer/customer.schema";
import { toast } from "sonner";
import { SUPER_CATEGORIES } from "@/lib/constants";
import { PREFECTURES } from "@/constants/prefectures";
import { CustomerAddressSection } from "./CustomerAddressSection";
import { priceListApi } from "@/services/priceList/priceList.api";
import { PaginatedDropdown } from "@/components/common/PaginatedDropdown";

export default function CustomerForm({
  superCategories,
  initialValues,
  initialPriceListLabel,
  isSubmitting = false,
  submitLabel = "Save",
  onSubmit,
}: CustomerFormProps) {
  const [values, setValues] = useState<CustomerFormValues>(initialValues);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(initialValues);
    setSubmitError(null);
    setErrors({});
  }, [initialValues]);

  const canSubmit = useMemo(() => {
    const isBaseValid =
      values.fullName?.trim()?.length > 0 &&
      values.email?.trim()?.length > 0 &&
      values.mobileNumber?.trim()?.length > 0 &&
      !!values?.superCategory;

    const areAddressesValid =
      values.addresses.length >= 1 &&
      values.addresses.every(
        (addr) =>
          addr.fullName?.trim()?.length > 0 &&
          addr.postalCode?.trim()?.length > 0 &&
          PREFECTURES.some((p) => p.code === addr?.prefecture) &&
          addr.city?.trim()?.length > 0 &&
          addr.streetAddress?.trim()?.length > 0 &&
          addr.phone?.trim()?.length > 0,
      );

    return isBaseValid && areAddressesValid;
  }, [values]);

  const updateAddress = (index: number, patch: Partial<IAddress>) => {
    setValues((prev) => {
      const next = [...prev.addresses];
      if (next[index]) {
        next[index] = { ...next[index], ...patch };
      }
      return { ...prev, addresses: next };
    });
  };

  const addAddress = () => {
    setValues((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          fullName: "",
          postalCode: "",
          prefecture: "",
          city: "",
          streetAddress: "",
          building: "",
          phone: "",
        },
      ],
    }));
  };

  const removeAddress = (index: number) => {
    setValues((prev) => ({
      ...prev,
      addresses: prev.addresses?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});

    if (!canSubmit) {
      setSubmitError(
        "Please fill all required fields (including at least one address).",
      );
      return;
    }

    const result = createCustomerSchema.safeParse(values);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues?.forEach((issue) => {
        const path = issue.path?.join(".");
        formattedErrors[path] = issue?.message;
      });
      setErrors(formattedErrors);
      setSubmitError("Please correct the errors before submitting.");
      toast.error("Please correct the errors before submitting.");
      return;
    }

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          {submitError}
        </div>
      )}

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Full Name"
            required
            placeholder="e.g. Taro Yamada"
            value={values.fullName}
            error={errors.fullName}
            onChange={(e) =>
              setValues((v) => ({ ...v, fullName: e.target.value }))
            }
          />
          <FormInput
            label="Email"
            required
            placeholder="e.g. taro@example.com"
            value={values.email}
            error={errors.email}
            onChange={(e) =>
              setValues((v) => ({ ...v, email: e.target.value }))
            }
          />
          <FormInput
            label="Mobile Number"
            required
            prefix="+81"
            placeholder="e.g. 9012345678"
            value={
              values.mobileNumber?.startsWith("+81")
                ? values.mobileNumber?.slice(3)
                : values.mobileNumber
            }
            error={errors.mobileNumber}
            onChange={(e) => {
              let val = e.target.value.replace(/[^\d]/g, "");
              if (val?.startsWith("0")) val = val?.slice(1);
              setValues((v) => ({
                ...v,
                mobileNumber: val ? `+81${val}` : "",
              }));
            }}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Super Category <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={values.superCategory}
              disabled={isSubmitting || superCategories?.length === 0}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  superCategory: e.target.value,
                  priceList: "",
                }))
              }
              className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                errors.superCategory ? "border-red-500" : "border-gray-200"
              }`}>
              <option value="" disabled>
                Select Super Category
              </option>
              {superCategories
                ?.filter((sc) => String(sc?.name) !== SUPER_CATEGORIES.RETAILER)
                ?.map((sc) => (
                  <option key={sc?._id} value={sc?._id}>
                    {sc?.name}
                  </option>
                ))}
            </select>
            {errors?.superCategory && (
              <p className="mt-1 text-xs text-red-600">
                {errors.superCategory}
              </p>
            )}
          </div>

          <div className="w-full md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Price list
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <PaginatedDropdown
              value={values.priceList}
              onValueChange={(v) =>
                setValues((prev) => ({ ...prev, priceList: v }))
              }
              queryKey={["priceLists", values.superCategory]}
              fetchData={async ({ search, page, limit }) => {
                if (!values.superCategory)
                  return { options: [], hasMore: false };
                const res = await priceListApi.getPriceLists({
                  superCategory: values.superCategory,
                  search,
                  page,
                  limit,
                });
                return {
                  options: res?.lists?.map((pl) => ({
                    value: pl._id,
                    label: pl.name,
                  })),
                  hasMore: res?.lists?.length === limit,
                };
              }}
              placeholder={
                values.superCategory
                  ? "Select a price list"
                  : "Select super category first"
              }
              searchPlaceholder="Search price lists..."
              disabled={isSubmitting || !values.superCategory}
              isClearable
              clearLabel="None — use segment base prices"
              selectedLabel={
                values.priceList === initialValues.priceList
                  ? initialPriceListLabel
                  : undefined
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              Only lists for the selected segment are shown. Changing segment
              clears this field.
            </p>
            {errors?.priceList && (
              <p className="mt-1 text-xs text-red-600">{errors.priceList}</p>
            )}
          </div>
        </div>
      </Card>

      <CustomerAddressSection
        addresses={values.addresses}
        errors={errors}
        isSubmitting={isSubmitting}
        onUpdate={updateAddress}
        onAdd={addAddress}
        onRemove={removeAddress}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
