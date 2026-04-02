"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import CmsForm from "../../_components/CmsForm";
import { useCmsDetail, useUpdateCms } from "@/services/cms/cms.hooks";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";

export default function EditCmsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: pageData, isLoading, isError, refetch } = useCmsDetail(id);
  const updateMutation = useUpdateCms();

  const handleSubmit = async (values: any) => {
    try {
      await updateMutation?.mutateAsync?.({
        id,
        data: values,
      });
      toast.success("Page updated successfully");
      router?.push?.(ROUTES?.CMS?.LIST);
    } catch (error) {
      toast.error("Failed to update page");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit Content Page"
        description="Update the slug, title, or HTML content of this page"
        showBack={true}
        backRoute={id ? ROUTES?.CMS?.DETAIL?.(id) : ROUTES?.CMS?.LIST}
      />

      <Card className="p-6">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError || !pageData ? (
          <CommonError
            message="Failed to load page details. Please try again."
            onRetry={refetch}
          />
        ) : (
          <CmsForm
            initialValues={{
              title: pageData?.title || "",
              slug: pageData?.slug || "",
              content: pageData?.content || "",
            }}
            isSubmitting={updateMutation?.isPending}
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
