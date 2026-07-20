"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import {
  useSubCategoryById,
  useUpdateSubCategory,
} from "@/services/subCategory/subCategory.hooks";
import SubCategoryForm from "../../_components/SubCategoryForm";
import { SubCategoryFormValues } from "@/types/subCategory/subCategory.types";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { EMPTY_TRANSLATION } from "@/components/common/TranslationInput";

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

  useEffect(() => {
    if (!parentId && subCategory) {
      const p = subCategory.parent as any;
      const extracted = typeof p === "string" ? p : p?._id;
      if (extracted) setParentId(extracted);
    }
  }, [parentId, subCategory]);

  const initialValues: SubCategoryFormValues = useMemo(
    () => ({
      name: subCategory?.name ?? EMPTY_TRANSLATION,
      slug: subCategory?.slug ?? "",
      description: subCategory?.description ?? EMPTY_TRANSLATION,
      parent: parentId,
    }),
    [subCategory, parentId],
  );

  const handleSubmit = (values: SubCategoryFormValues) => {
    updateMutation.mutate(
      {
        name: values.name,
        slug: values.slug,
        description: values.description,
        parent: values.parent,
      },
      {
        onSuccess: () => router.push(ROUTES.SUBCATEGORIES.LIST),
      },
    );
  };

  const ready = !isSubLoading && !!subCategory && !!parentId;

  // Extract parent label
  const parentName =
    (subCategory?.parent as any)?.name?.en ||
    (typeof subCategory?.parent === "string" ? subCategory?.parent : undefined);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Edit SubCategory"
        description="Update subcategory details"
        backRoute={ROUTES.SUBCATEGORIES.DETAIL(id)}
      />

      <Card className="p-6">
        {isSubLoading ? (
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
            initialValues={initialValues}
            initialParentLabel={parentName}
            isSubmitting={updateMutation.isPending}
            submitLabel="Update SubCategory"
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
