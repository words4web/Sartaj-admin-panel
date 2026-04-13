"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/FormInput";
import { IAddress } from "@/types/customer/customer.types";
import { fetchPrefectures, getPrefectureName } from "@/constants/prefectures";
import { PaginatedDropdown } from "@/components/common/PaginatedDropdown";

interface CustomerAddressSectionProps {
  addresses: IAddress[];
  errors: Record<string, string>;
  isSubmitting: boolean;
  onUpdate: (index: number, patch: Partial<IAddress>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function CustomerAddressSection({
  addresses,
  errors,
  isSubmitting,
  onUpdate,
  onAdd,
  onRemove,
}: CustomerAddressSectionProps) {
  return (
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
          onClick={onAdd}
          disabled={isSubmitting}>
          + Add Address
        </Button>
      </div>

      <div className="space-y-4">
        {addresses?.map((addr, idx) => (
          <Card key={addr?._id || idx} className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-medium">Address #{idx + 1}</h4>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting || addresses?.length <= 1}
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onRemove(idx)}>
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
                onChange={(e) => onUpdate(idx, { fullName: e.target.value })}
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
                  onUpdate(idx, { postalCode: val });
                }}
              />
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Prefecture <span className="text-red-500 ml-1">*</span>
                </label>
                <PaginatedDropdown
                  value={addr?.prefecture}
                  onValueChange={(code) => onUpdate(idx, { prefecture: code })}
                  fetchData={fetchPrefectures}
                  queryKey={["prefectures", "dropdown"]}
                  placeholder="Select Prefecture"
                  searchPlaceholder="Search prefectures..."
                  disabled={isSubmitting}
                  selectedLabel={getPrefectureName(addr?.prefecture)}
                />
                {errors[`addresses.${idx}.prefecture`] && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors[`addresses.${idx}.prefecture`]}
                  </p>
                )}
              </div>
              <FormInput
                label="City"
                required
                placeholder="e.g. Chiyoda-ku"
                value={addr?.city}
                error={errors[`addresses.${idx}.city`]}
                onChange={(e) => onUpdate(idx, { city: e.target.value })}
              />
            </div>

            <FormInput
              label="Street Address"
              required
              placeholder="e.g. 1-1 Chiyoda"
              value={addr?.streetAddress}
              error={errors[`addresses.${idx}.streetAddress`]}
              onChange={(e) => onUpdate(idx, { streetAddress: e.target.value })}
            />

            <FormInput
              label="Building / Suite (optional)"
              placeholder="e.g. Mansion name 101"
              value={addr?.building || ""}
              error={errors[`addresses.${idx}.building`]}
              onChange={(e) => onUpdate(idx, { building: e.target.value })}
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
                onUpdate(idx, { phone: val ? `+81${val}` : "" });
              }}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
