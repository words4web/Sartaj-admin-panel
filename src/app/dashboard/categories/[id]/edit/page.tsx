"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import {
  useCategoryById,
  useUpdateCategory,
} from "@/services/category/category.hooks";
import CategoryForm from "../../_components/CategoryForm";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { CategoryFormValues } from "@/types/category/category.types";
import { EMPTY_TRANSLATION } from "@/components/common/TranslationInput";

export default function CategoryEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    data: category,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    refetch,
  } = useCategoryById(id);
  const updateMutation = useUpdateCategory(id);

  const initialValues: CategoryFormValues = {
    name: category?.name ?? EMPTY_TRANSLATION,
    description: category?.description ?? EMPTY_TRANSLATION,
    existingImage: category?.image ?? null,
  };

  const handleSubmit = (values: CategoryFormValues) => {
    updateMutation.mutate(
      {
        name: values.name,
        description: values.description,
        image: values.image,
      },
      {
        onSuccess: () => router.push(ROUTES.CATEGORIES.LIST),
      },
    );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit Category"
        description="Update category details"
        backRoute={ROUTES.CATEGORIES.DETAIL(id)}
      />

      <Card className="p-6">
        {isCategoryLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isCategoryError || !category ? (
          <CommonError
            message="Failed to load category for editing."
            onRetry={refetch}
          />
        ) : (
          <CategoryForm
            initialValues={initialValues}
            isSubmitting={updateMutation.isPending}
            submitLabel="Update Category"
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
