"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { useCategoryList } from "@/services/category/category.hooks";
import { useCreateSubCategory } from "@/services/subCategory/subCategory.hooks";
import SubCategoryForm from "../_components/SubCategoryForm";
import { SubCategoryFormValues } from "@/types/subCategory/subCategory.types";
import { CommonLoader } from "@/components/ui/common-loader";
import { getSubCategoryDefaultValues } from "@/schemas/subCategory/subCategory.default";

export default function SubCategoryCreatePage() {
  const router = useRouter();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategoryList({ page: 1, limit: 100 });
  const topLevelCategories = categoriesData?.categories ?? [];

  const createMutation = useCreateSubCategory();
  const [parentId, setParentId] = useState<string>("");

  useEffect(() => {
    if (!parentId && topLevelCategories?.length > 0) {
      setParentId(topLevelCategories[0]?._id);
    }
  }, [parentId, topLevelCategories]);

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
    () => getSubCategoryDefaultValues(parentId),
    [parentId],
  );

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Add SubCategory"
        description="Create a new subcategory under a parent category"
        backRoute={ROUTES.SUBCATEGORIES.LIST}
      />

      <Card className="p-6">
        {isCategoriesLoading ? (
          <CommonLoader fullScreen={false} />
        ) : (
          <SubCategoryForm
            categories={topLevelCategories}
            initialValues={initialValues}
            isSubmitting={createMutation.isPending}
            submitLabel="Create SubCategory"
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
