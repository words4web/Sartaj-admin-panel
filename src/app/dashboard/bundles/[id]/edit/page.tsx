"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import BundleForm from "../../_components/BundleForm";
import {
  useGetBundleById,
  useUpdateBundle,
} from "@/services/bundle/bundle.hooks";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";

export default function EditBundlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: bundle, isLoading, isError, refetch } = useGetBundleById(id);
  const updateMutation = useUpdateBundle();

  const handleSubmit = (values: {
    title: string;
    productIds: string[];
    discountValue: number;
  }) => {
    updateMutation.mutate(
      { id, data: values },
      {
        onSuccess: () => router.push(ROUTES.BUNDLES.LIST),
      },
    );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit Bundle"
        description="Update bundle items, title or discount value"
        showBack={true}
        backRoute={ROUTES.BUNDLES.LIST}
      />

      <Card className="p-6 max-w-2xl">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError || !bundle ? (
          <CommonError
            message="Failed to load bundle details. Please try again."
            onRetry={refetch}
          />
        ) : (
          <BundleForm
            initialData={bundle}
            isSubmitting={updateMutation.isPending}
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
