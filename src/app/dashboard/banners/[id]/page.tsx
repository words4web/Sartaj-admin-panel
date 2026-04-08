"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { useBanner } from "@/services/banner/banner.hooks";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { TranslationDisplay } from "@/components/common/TranslationDisplay";
import { dateUtils } from "@/utils/common.utils";

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
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-100">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {banner?.title?.en || "Untitled Banner"}
                </h2>
                <p className="text-sm text-gray-500">
                  Preview and translations
                </p>
              </div>
              <Badge variant={banner?.isActive ? "success" : "secondary"}>
                {banner?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <TranslationDisplay
                  title="Banner Title Translations"
                  fields={[{ key: "title", label: "Title" }]}
                  values={{ title: banner.title }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                      Target Link
                    </p>
                    <p className="text-sm font-medium text-blue-600 break-all bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                      {banner?.link || "No link provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Banner Preview
                </h3>
                <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 overflow-hidden p-6 aspect-[3/1] flex items-center justify-center">
                  <div className="relative w-full h-full shadow-2xl rounded-xl overflow-hidden ring-1 ring-gray-100">
                    <img
                      src={banner?.image}
                      alt={banner?.title?.en || "Banner Preview"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/1200x400/e2e8f0/64748b?text=Banner+Image+Not+Found";
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-center text-gray-400 italic">
                  Visual representation of the banner as seen on the mobile app.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
