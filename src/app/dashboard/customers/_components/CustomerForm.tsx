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

export default function CustomerForm({
  superCategories,
  initialValues,
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
          addr.prefecture?.trim()?.length > 0 &&
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
              disabled={isSubmitting || superCategories.length === 0}
              onChange={(e) =>
                setValues((v) => ({ ...v, superCategory: e.target.value }))
              }
              className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                errors.superCategory ? "border-red-500" : "border-gray-200"
              }`}>
              <option value="" disabled>
                Select Super Category
              </option>
              {superCategories?.map((sc) => (
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
        </div>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Addresses</h3>
            <p className="text-sm text-gray-600">
              Japan-specific postal code and phone formats.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addAddress}
            disabled={isSubmitting}>
            + Add Address
          </Button>
        </div>

        <div className="space-y-4">
          {values.addresses?.map((addr, idx) => (
            <Card key={addr?._id || idx} className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-medium">Address #{idx + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting || values.addresses?.length <= 1}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => removeAddress(idx)}>
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Address Full Name"
                  required
                  placeholder="e.g. Taro Yamada (Home)"
                  value={addr?.fullName}
                  error={errors[`addresses.${idx}.fullName`]}
                  onChange={(e) =>
                    updateAddress(idx, { fullName: e.target.value })
                  }
                />
                <FormInput
                  label="Postal Code (XXX-XXXX)"
                  required
                  placeholder="e.g. 100-0001"
                  value={addr?.postalCode}
                  error={errors[`addresses.${idx}.postalCode`]}
                  onChange={(e) => {
                    let val = e.target.value?.replace(/[^\d]/g, "");
                    if (val?.length > 7) val = val?.slice(0, 7);
                    if (val?.length > 3) {
                      val = `${val?.slice(0, 3)}-${val?.slice(3)}`;
                    }
                    updateAddress(idx, { postalCode: val });
                  }}
                />
                <FormInput
                  label="Prefecture"
                  required
                  placeholder="e.g. Tokyo"
                  value={addr?.prefecture}
                  error={errors[`addresses.${idx}.prefecture`]}
                  onChange={(e) =>
                    updateAddress(idx, { prefecture: e.target.value })
                  }
                />
                <FormInput
                  label="City"
                  required
                  placeholder="e.g. Chiyoda-ku"
                  value={addr?.city}
                  error={errors[`addresses.${idx}.city`]}
                  onChange={(e) => updateAddress(idx, { city: e.target.value })}
                />
              </div>

              <FormInput
                label="Street Address"
                required
                placeholder="e.g. 1-1 Chiyoda"
                value={addr?.streetAddress}
                error={errors[`addresses.${idx}.streetAddress`]}
                onChange={(e) =>
                  updateAddress(idx, { streetAddress: e.target.value })
                }
              />

              <FormInput
                label="Building / Suite (optional)"
                placeholder="e.g. Mansion name 101"
                value={addr?.building || ""}
                error={errors[`addresses.${idx}.building`]}
                onChange={(e) =>
                  updateAddress(idx, { building: e.target.value })
                }
              />

              <FormInput
                label="Phone (Japan)"
                required
                prefix="+81"
                placeholder="e.g. 9012345678"
                value={
                  addr?.phone?.startsWith("+81")
                    ? addr?.phone?.slice(3)
                    : addr?.phone
                }
                error={errors[`addresses.${idx}.phone`]}
                onChange={(e) => {
                  let val = e.target.value?.replace(/[^\d]/g, "");
                  if (val?.startsWith("0")) val = val?.slice(1);
                  updateAddress(idx, { phone: val ? `+81${val}` : "" });
                }}
              />
            </Card>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
