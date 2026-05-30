"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/FormInput";
import { IAddress } from "@/types/customer/customer.types";
import {
  fetchPrefectures,
  getPrefectureName,
  PREFECTURES,
} from "@/constants/prefectures";
import { PaginatedDropdown } from "@/components/common/PaginatedDropdown";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomerAddressSectionProps {
  addresses: IAddress[];
  errors: Record<string, string>;
  isSubmitting: boolean;
  onUpdate: (index: number, patch: Partial<IAddress>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

interface AreaSelectionModalState {
  isOpen: boolean;
  index: number;
  zipcode: string;
  results: Array<{
    address1: string;
    address2: string;
    address3: string;
    prefcode: string;
  }>;
}

export function CustomerAddressSection({
  addresses,
  errors,
  isSubmitting,
  onUpdate,
  onAdd,
  onRemove,
}: CustomerAddressSectionProps) {
  const [loadingIndexes, setLoadingIndexes] = useState<Record<number, boolean>>(
    {},
  );
  const [lastSearchedZip, setLastSearchedZip] = useState<
    Record<number, string>
  >({});
  const [modalState, setModalState] = useState<AreaSelectionModalState>({
    isOpen: false,
    index: 0,
    zipcode: "",
    results: [],
  });

  const searchZipcode = async (index: number, code: string) => {
    const cleanZip = code?.replace(/[^\d]/g, "");
    if (cleanZip?.length !== 7) return;

    setLoadingIndexes((prev) => ({ ...prev, [index]: true }));

    try {
      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`,
      );
      const data = await response.json();

      if (data?.status !== 200) {
        toast.error(data?.message || "Failed to search postal code.");
        return;
      }

      if (!data?.results || data?.results?.length === 0) {
        toast.error("Postal code not found.");
        return;
      }

      const results = data?.results;
      if (results?.length === 1) {
        const result = results?.[0];
        const prefCode = "JP-" + String(result?.prefcode)?.padStart(2, "0");
        const matchedPref = PREFECTURES.find((p) => p?.code === prefCode);
        onUpdate(index, {
          prefecture: matchedPref ? matchedPref?.code : prefCode,
          city: result?.address2 || "",
          streetAddress: result?.address3 || "",
        });
        toast.success("Address auto-filled successfully!");
      } else if (results?.length > 1) {
        setModalState({
          isOpen: true,
          index,
          zipcode: cleanZip,
          results,
        });
      }
    } catch (err) {
      console.error("ZipCloud fetch error:", err);
      toast.error("Failed to search postal code.");
    } finally {
      setLoadingIndexes((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleSelectArea = (result: (typeof modalState.results)[0]) => {
    const prefCode = "JP-" + String(result?.prefcode)?.padStart(2, "0");
    const matchedPref = PREFECTURES.find((p) => p?.code === prefCode);
    onUpdate(modalState.index, {
      prefecture: matchedPref ? matchedPref?.code : prefCode,
      city: result.address2 || "",
      streetAddress: result?.address3 || "",
    });
    setModalState((prev) => ({ ...prev, isOpen: false }));
    toast.success("Address auto-filled successfully!");
  };

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
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Postal Code (XXX-XXXX){" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      placeholder="e.g. 100-0001"
                      value={addr?.postalCode}
                      disabled={isSubmitting || loadingIndexes?.[idx]}
                      onChange={(e) => {
                        let val = e.target.value?.replace(/[^\d]/g, "");
                        if (val?.length > 7) val = val?.slice(0, 7);
                        if (val?.length > 3) {
                          val = `${val?.slice(0, 3)}-${val?.slice(3)}`;
                        }
                        onUpdate(idx, { postalCode: val });
                      }}
                      className={`w-full py-2.5 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 placeholder:text-gray-400 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed hover:border-gray-300 ${
                        errors[`addresses.${idx}.postalCode`]
                          ? "border-red-500 focus:ring-red-500/30 focus:border-red-500"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      isSubmitting ||
                      loadingIndexes?.[idx] ||
                      addr?.postalCode?.replace(/[^\d]/g, "")?.length !== 7
                    }
                    onClick={() => {
                      const cleanZip = addr?.postalCode?.replace(/[^\d]/g, "");
                      if (cleanZip?.length === 7) {
                        searchZipcode(idx, cleanZip);
                      }
                    }}
                    className="shrink-0 h-[46px] rounded-lg px-4 font-semibold border-blue-200 text-blue-700 hover:text-blue-700 cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-colors">
                    {loadingIndexes?.[idx] ? "Searching..." : "Lookup Address"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  Enter 7 digits and click "Lookup Address" to pre-fill
                  prefecture, city, and street address.
                </p>
                {errors[`addresses.${idx}.postalCode`] && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors[`addresses.${idx}.postalCode`]}
                  </p>
                )}
              </div>
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

      <Dialog
        open={modalState?.isOpen}
        onOpenChange={(open) => {
          if (!open) setModalState((prev) => ({ ...prev, isOpen: false }));
        }}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl p-6 bg-white shadow-xl border border-gray-100">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Select Area
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
            <p className="text-sm text-gray-500 mb-2">
              Multiple areas match postal code{" "}
              <span className="font-semibold text-blue-600">
                {modalState?.zipcode?.slice(0, 3)}-
                {modalState?.zipcode?.slice(3)}
              </span>
              . Please select one:
            </p>
            {modalState?.results?.map((res, rIdx) => (
              <button
                key={rIdx}
                type="button"
                onClick={() => handleSelectArea(res)}
                className="w-full text-left p-3.5 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 group flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                    {res?.address3}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {res?.address1} {res?.address2}
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border border-gray-300 group-hover:border-blue-500 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
