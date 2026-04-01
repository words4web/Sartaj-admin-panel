"use client";

import { useRouter } from "next/navigation";
import { useCreateBanner } from "@/services/banner/banner.hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { BannerFormValues } from "@/types/banner/banner.types";
import BannerForm from "../_components/BannerForm";
import { Card } from "@/components/ui/card";

export default function NewBannerPage() {
  const router = useRouter();
  const createMutation = useCreateBanner();

  const handleCreate = async (values: BannerFormValues) => {
    await createMutation?.mutateAsync(
      {
        title: values?.title || undefined,
        link: values?.link || undefined,
        isActive: values?.isActive,
        image: values?.image!,
      },
      {
        onSuccess: () => router?.push(ROUTES?.BANNERS?.LIST),
      },
    );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="New Banner"
        description="Create a new promotional banner"
        showBack={true}
        backRoute={ROUTES?.BANNERS?.LIST}
      />

      <Card className="p-6">
        <BannerForm
          initialValues={{
            title: "",
            link: "",
            isActive: true,
            image: null,
          }}
          isSubmitting={createMutation?.isPending}
          onSubmit={handleCreate}
          submitLabel="Create Banner"
        />
      </Card>
    </div>
  );
}
