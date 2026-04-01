"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import BannerForm from "../../_components/BannerForm";
import { useBanner, useUpdateBanner } from "@/services/banner/banner.hooks";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";

export default function EditBannerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: banner, isLoading, isError, refetch } = useBanner(id);
  const updateMutation = useUpdateBanner();

  const handleSubmit = async (values: any) => {
    try {
      await updateMutation?.mutateAsync({
        id,
        data: {
          title: values?.title,
          link: values?.link,
          image: values?.image,
          isActive: values?.isActive,
        },
      });
      toast?.success("Banner updated successfully");
      router?.push(ROUTES?.BANNERS?.LIST);
    } catch (error) {
      toast?.error("Failed to update banner");
      console?.error(error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit Banner"
        description="Update banner details and image"
        showBack={true}
        backRoute={ROUTES?.BANNERS?.DETAIL(id)}
      />

      <Card className="p-6">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError || !banner ? (
          <CommonError
            message="Failed to load banner details. Please try again."
            onRetry={refetch}
          />
        ) : (
          <BannerForm
            initialValues={{
              title: banner?.title || "",
              link: banner?.link || "",
              isActive: banner?.isActive ?? true,
              existingImage: banner?.image,
            }}
            isSubmitting={updateMutation?.isPending}
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
