"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { useCmsDetail } from "@/services/cms/cms.hooks";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { FileText, Link as LinkIcon } from "lucide-react";

export default function CmsDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: pageData, isLoading, isError, refetch } = useCmsDetail(id);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Page Details"
        description="Preview of the CMS page content"
        backRoute={ROUTES?.CMS?.LIST}
        editRoute={pageData?._id ? ROUTES?.CMS?.EDIT(pageData?._id) : undefined}
      />

      {isLoading ? (
        <Card className="p-6">
          <CommonLoader fullScreen={false} />
        </Card>
      ) : isError || !pageData ? (
        <Card className="p-6">
          <CommonError
            message="Failed to load page details. Please check your connection."
            onRetry={refetch}
          />
        </Card>
      ) : (
        <div>
          {/* Main Info */}
          <Card className="p-10 space-y-8 shadow-sm">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/5 text-primary rounded-xl shrink-0">
                  <FileText size={32} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 capitalize break-words">
                    {pageData?.title}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-500 mt-1.5 overflow-hidden">
                    <LinkIcon size={16} className="text-gray-400 shrink-0" />
                    <span className="font-mono text-sm bg-gray-100/80 px-2 py-1 rounded text-primary/80 break-all">
                      /{pageData?.slug}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Rich Text Content Preview
                </h3>
              </div>
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-slate">
                <div
                  className="bg-white border border-gray-100 rounded-xl p-8 min-h-[400px] shadow-inner text-gray-700 leading-relaxed overflow-x-auto break-words"
                  dangerouslySetInnerHTML={{
                    __html: pageData?.content || "No content provided.",
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
