"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { useManufacturer } from "@/services/manufacturer/manufacturer.hooks";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { TranslationDisplay } from "@/components/common/TranslationDisplay";
import { dateUtils } from "@/utils/common.utils";

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
        backRoute={ROUTES.MANUFACTURERS.LIST}
        editRoute={
          manufacturer?._id
            ? ROUTES.MANUFACTURERS.EDIT(manufacturer?._id)
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
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-100">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {manufacturer?.name?.en || "Untitled Manufacturer"}
                </h2>
                <p className="text-sm text-gray-500">
                  Brand information and logo
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <TranslationDisplay
                  title="Manufacturer Name Translations"
                  fields={[{ key: "name", label: "Name" }]}
                  values={{ name: manufacturer.name }}
                />

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                      Created At
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {manufacturer?.createdAt
                        ? dateUtils?.format(manufacturer?.createdAt)
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                      Last Updated
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {manufacturer?.updatedAt
                        ? dateUtils?.format(manufacturer?.updatedAt)
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Manufacturer Logo
                </h3>
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="w-64 h-64 bg-white rounded-2xl shadow-xl overflow-hidden p-6 flex items-center justify-center ring-1 ring-gray-100">
                    <img
                      src={manufacturer?.image}
                      alt={manufacturer?.name?.en}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        if (e?.currentTarget) {
                          e.currentTarget.src =
                            "https://placehold.co/400x400/e2e8f0/64748b?text=Logo+Not+Found";
                        }
                      }}
                    />
                  </div>
                  <p className="mt-6 text-xs text-gray-400 italic text-center">
                    Official logo for {manufacturer?.name?.en}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
