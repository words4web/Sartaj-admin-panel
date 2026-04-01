"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import CategoryForm from "../_components/CategoryForm";
import { useCreateCategory } from "@/services/category/category.hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { CategoryFormValues } from "@/types/category/category.types";

export default function CategoryCreatePage() {
  const router = useRouter();
  const createMutation = useCreateCategory();

  const handleSubmit = (values: CategoryFormValues) => {
    createMutation.mutate(
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
        title="Add Category"
        description="Create a new product category"
        backRoute={ROUTES.CATEGORIES.LIST}
      />

      <Card className="p-6">
        <CategoryForm
          initialValues={{ name: "", description: "", image: null }}
          isSubmitting={createMutation.isPending}
          submitLabel="Create Category"
          requireImage={true}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
