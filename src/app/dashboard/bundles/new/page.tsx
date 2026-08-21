"use client";

import { useRouter } from "next/navigation";
import { useCreateBundle } from "@/services/bundle/bundle.hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import BundleForm from "../_components/BundleForm";
import { Card } from "@/components/ui/card";

export default function NewBundlePage() {
  const router = useRouter();
  const createMutation = useCreateBundle();

  const handleCreate = (values: {
    title: string;
    productIds: string[];
    discountValue: number;
  }) => {
    createMutation.mutate(values, {
      onSuccess: () => router.push(ROUTES.BUNDLES.LIST),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="New Bundle"
        description="Create a product combo pack with a fixed price discount"
        showBack={true}
        backRoute={ROUTES.BUNDLES.LIST}
      />

      <Card className="p-6 max-w-2xl">
        <BundleForm
          isSubmitting={createMutation.isPending}
          onSubmit={handleCreate}
        />
      </Card>
    </div>
  );
}
