"use client";

import { useRouter } from "next/navigation";
import { useCreateManufacturer } from "@/services/manufacturer/manufacturer.hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { ManufacturerFormValues } from "@/types/manufacturer/manufacturer.types";
import ManufacturerForm from "../_components/ManufacturerForm";
import { Card } from "@/components/ui/card";
import { EMPTY_TRANSLATION } from "@/components/common/TranslationInput";

export default function NewManufacturerPage() {
  const router = useRouter();
  const createMutation = useCreateManufacturer();

  const handleCreate = async (values: ManufacturerFormValues) => {
    await createMutation?.mutateAsync(
      {
        name: values?.name,
        image: values?.image!,
      },
      {
        onSuccess: () => router?.push(ROUTES?.MANUFACTURERS?.LIST),
      },
    );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="New Manufacturer"
        description="Add a new brand or manufacturer"
        showBack={true}
        backRoute={ROUTES?.MANUFACTURERS?.LIST}
      />

      <Card className="p-6">
        <ManufacturerForm
          initialValues={{
            name: EMPTY_TRANSLATION,
            image: null,
          }}
          isSubmitting={createMutation?.isPending}
          onSubmit={handleCreate}
          submitLabel="Create Manufacturer"
        />
      </Card>
    </div>
  );
}
