"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import ManufacturerForm from "../../_components/ManufacturerForm";
import {
  useManufacturer,
  useUpdateManufacturer,
} from "@/services/manufacturer/manufacturer.hooks";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { EMPTY_TRANSLATION } from "@/components/common/TranslationInput";

export default function EditManufacturerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    data: manufacturer,
    isLoading,
    isError,
    refetch,
  } = useManufacturer(id);
  const updateMutation = useUpdateManufacturer();

  const handleSubmit = async (values: any) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          name: values?.name,
          slug: values?.slug,
          image: values?.image,
        },
      });
      router.push(ROUTES.MANUFACTURERS.LIST);
    } catch (error) {
      toast.error("Failed to update manufacturer");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit Manufacturer"
        description="Update manufacturer name or logo"
        showBack={true}
        backRoute={ROUTES.MANUFACTURERS.DETAIL(id)}
      />

      <Card className="p-6">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError || !manufacturer ? (
          <CommonError
            message="Failed to load manufacturer details. Please try again."
            onRetry={refetch}
          />
        ) : (
          <ManufacturerForm
            initialValues={{
              name: manufacturer?.name || EMPTY_TRANSLATION,
              slug: manufacturer?.slug || "",
              image: null,
              existingImage: manufacturer?.image,
            }}
            isSubmitting={updateMutation.isPending}
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
