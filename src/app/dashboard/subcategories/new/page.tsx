"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { useCreateSubCategory } from "@/services/subCategory/subCategory.hooks";
import SubCategoryForm from "../_components/SubCategoryForm";
import { SubCategoryFormValues } from "@/types/subCategory/subCategory.types";
import { getSubCategoryDefaultValues } from "@/schemas/subCategory/subCategory.default";

export default function SubCategoryCreatePage() {
  const router = useRouter();
  const createMutation = useCreateSubCategory();

  const handleSubmit = (values: SubCategoryFormValues) => {
    createMutation.mutate(
      {
        name: values.name,
        description: values.description,
        parent: values.parent,
      },
      {
        onSuccess: () => {
          router.push(ROUTES.SUBCATEGORIES.LIST);
        },
      },
    );
  };

  const initialValues: SubCategoryFormValues = useMemo(
    () => getSubCategoryDefaultValues(""),
    [],
  );

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Add SubCategory"
        description="Create a new subcategory under a parent category"
        backRoute={ROUTES.SUBCATEGORIES.LIST}
      />

      <Card className="p-6">
        <SubCategoryForm
          initialValues={initialValues}
          isSubmitting={createMutation.isPending}
          submitLabel="Create SubCategory"
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
