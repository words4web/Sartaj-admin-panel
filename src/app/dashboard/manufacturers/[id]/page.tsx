"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { useManufacturer } from "@/services/manufacturer/manufacturer.hooks";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { dateUtils } from "@/lib/utils";

export default function ManufacturerDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: manufacturer,
    isLoading,
    isError,
    refetch,
  } = useManufacturer(id);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Manufacturer Details"
        description="View manufacturer information and logo"
        backRoute={ROUTES?.MANUFACTURERS?.LIST}
        editRoute={
          manufacturer?._id
            ? ROUTES?.MANUFACTURERS?.EDIT(manufacturer?._id)
            : undefined
        }
      />

      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <CommonLoader fullScreen={false} />
          </div>
        ) : isError || !manufacturer ? (
          <CommonError
            message="Failed to load manufacturer details. Please check your connection."
            onRetry={refetch}
          />
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">{manufacturer?.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-500 uppercase tracking-wider font-semibold text-gray-400">
                    Created At
                  </p>
                  <p className="font-medium text-gray-700 text-sm">
                    {manufacturer?.createdAt
                      ? dateUtils?.format(manufacturer?.createdAt)
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wider font-semibold text-gray-400">
                    Last Updated
                  </p>
                  <p className="font-medium text-gray-700 text-sm">
                    {manufacturer?.updatedAt
                      ? dateUtils?.format(manufacturer?.updatedAt)
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Manufacturer Logo</h3>
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-64 h-64 bg-white rounded-xl shadow-md overflow-hidden p-4 flex items-center justify-center border">
                  <img
                    src={manufacturer?.image}
                    alt={manufacturer?.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      if (e?.currentTarget) {
                        e.currentTarget.src =
                          "https://placehold.co/400x400/e2e8f0/64748b?text=Logo+Not+Found";
                      }
                    }}
                  />
                </div>
                <p className="mt-6 text-sm text-gray-400 italic">
                  Official logo for {manufacturer?.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
