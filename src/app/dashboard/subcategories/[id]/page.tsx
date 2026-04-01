"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { useSubCategoryById } from "@/services/subCategory/subCategory.hooks";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { ICategory } from "@/types/category/category.types";
import { dateUtils } from "@/lib/utils";

export default function SubCategoryDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: subCategory,
    isLoading,
    isError,
    refetch,
  } = useSubCategoryById(id);

  const parentName =
    (subCategory?.parent as ICategory)?.name ||
    (typeof subCategory?.parent === "string"
      ? subCategory.parent
      : undefined) ||
    "—";

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="SubCategory Details"
        description="View subcategory information"
        backRoute={ROUTES.SUBCATEGORIES.LIST}
        editRoute={
          subCategory?._id
            ? ROUTES.SUBCATEGORIES.EDIT(subCategory?._id)
            : undefined
        }
      />

      <Card className="p-6">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError || !subCategory ? (
          <CommonError onRetry={refetch} />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold">{subCategory?.name}</h2>
              <Badge variant={subCategory?.isActive ? "default" : "secondary"}>
                {subCategory?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <p className="text-gray-700">{subCategory?.description || "—"}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Parent Category</p>
                <p className="font-medium text-gray-900">{parentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {subCategory?.createdAt &&
                    dateUtils.formatDateTime(subCategory?.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Updated</p>
                <p className="font-medium text-gray-900">
                  {subCategory?.updatedAt &&
                    dateUtils.formatDateTime(subCategory?.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
