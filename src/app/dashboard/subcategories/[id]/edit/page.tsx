"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { useCategoryList } from "@/services/category/category.hooks";
import {
  useSubCategoryById,
  useUpdateSubCategory,
} from "@/services/subCategory/subCategory.hooks";
import SubCategoryForm from "../../_components/SubCategoryForm";
import { SubCategoryFormValues } from "@/types/subCategory/subCategory.types";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";

export default function SubCategoryEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [parentId, setParentId] = useState<string>("");
  const updateMutation = useUpdateSubCategory(id);

  const {
    data: subCategory,
    isLoading: isSubLoading,
    isError: isSubError,
    refetch: refetchSubCategory,
  } = useSubCategoryById(id);

  const { data: categoriesData, isLoading: isCatsLoading } = useCategoryList({
    page: 1,
    limit: 100,
  });

  useEffect(() => {
    if (!parentId && subCategory) {
      const p = subCategory.parent as any;
      const extracted = typeof p === "string" ? p : p?._id;
      if (extracted) setParentId(extracted);
    }
  }, [parentId, subCategory]);

  const initialValues: SubCategoryFormValues = useMemo(
    () => ({
      name: subCategory?.name ?? "",
      description: subCategory?.description ?? "",
      parent: parentId,
    }),
    [subCategory, parentId],
  );

  const handleSubmit = (values: SubCategoryFormValues) => {
    updateMutation.mutate(
      {
        name: values.name,
        description: values.description,
        parent: values.parent,
      },
      {
        onSuccess: () => router.push(ROUTES.SUBCATEGORIES.LIST),
      },
    );
  };

  const ready = !isSubLoading && !isCatsLoading && !!subCategory && !!parentId;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit SubCategory"
        description="Update subcategory details"
        backRoute={ROUTES.SUBCATEGORIES.DETAIL(id)}
      />

      <Card className="p-6">
        {isSubLoading || isCatsLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isSubError || !subCategory ? (
          <CommonError
            message="Failed to load subcategory"
            onRetry={refetchSubCategory}
          />
        ) : !ready ? (
          <CommonLoader fullScreen={false} />
        ) : (
          <SubCategoryForm
            categories={categoriesData?.categories ?? []}
            initialValues={initialValues}
            isSubmitting={updateMutation.isPending}
            submitLabel="Update SubCategory"
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
