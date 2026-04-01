"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { useBanner } from "@/services/banner/banner.hooks";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { dateUtils } from "@/lib/utils";

export default function BannerDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: banner, isLoading, isError, refetch } = useBanner(id);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Banner Details"
        description="View banner information and preview"
        backRoute={ROUTES?.BANNERS?.LIST}
        editRoute={banner?._id ? ROUTES?.BANNERS?.EDIT(banner?._id) : undefined}
      />

      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <CommonLoader fullScreen={false} />
          </div>
        ) : isError || !banner ? (
          <CommonError
            message="Failed to load banner details. Please check your connection."
            onRetry={refetch}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold">
                {banner?.title || "Untitled Banner"}
              </h2>
              <Badge variant={banner?.isActive ? "success" : "secondary"}>
                {banner?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <p className="text-sm text-gray-500 pt-2 border-t border-gray-200">
              Banner ID: {banner?._id}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold text-xs text-gray-400">
                  Target Link
                </p>
                <p className="font-medium text-blue-600 break-all">
                  {banner?.link || "No link provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-500 uppercase tracking-wider font-semibold text-gray-400">
                    Created At
                  </p>
                  <p className="font-medium text-gray-700 text-sm">
                    {banner?.createdAt
                      ? dateUtils?.format(banner?.createdAt)
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wider font-semibold text-gray-400">
                    Last Updated
                  </p>
                  <p className="font-medium text-gray-700 text-sm">
                    {banner?.updatedAt
                      ? dateUtils?.format(banner?.updatedAt)
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Banner Preview</h3>
              <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 overflow-hidden flex items-center justify-center p-4">
                <div className="relative w-full max-w-4xl shadow-lg rounded-lg overflow-hidden h-[300px]">
                  <img
                    src={banner?.image}
                    alt={banner?.title || "Banner Preview"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/1200x400/e2e8f0/64748b?text=Banner+Image+Not+Found";
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-center text-gray-400 mt-4 italic">
                This is how the banner will appear in the mobile application.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
